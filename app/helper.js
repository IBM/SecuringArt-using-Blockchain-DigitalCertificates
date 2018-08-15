/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an 'AS IS' BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var log4js = require('log4js');
var logger = log4js.getLogger('Helper');
logger.setLevel('DEBUG');

var path = require('path');
var util = require('util');
const crypto = require('crypto');

var hfc = require('fabric-client');
hfc.setLogger(logger);

var sleep = async function (sleep_time_ms) {
	return new Promise(resolve => setTimeout(resolve, sleep_time_ms));
}

async function getClientForOrg (userorg, username) {
	logger.debug('getClientForOrg - ****** START %s %s', userorg, username)
	// get a fabric client loaded with a connection profile for this org
	let config = '-connection-profile-path';

	// build a client context and load it with a connection profile
	// lets only load the network settings and save the client for later
	let client = hfc.loadFromConfig(hfc.getConfigSetting('network'+config));

	// This will load a connection profile over the top of the current one one
	// since the first one did not have a client section and the following one does
	// nothing will actually be replaced.
	// This will also set an admin identity because the organization defined in the
	// client section has one defined
	client.loadFromConfig(hfc.getConfigSetting(userorg+config));

	// this will create both the state store and the crypto store based
	// on the settings in the client section of the connection profile
	await client.initCredentialStores();

	// The getUserContext call tries to get the user from persistence.
	// If the user has been saved to persistence then that means the user has
	// been registered and enrolled. If the user is found in persistence
	// the call will then assign the user to the client object.
	if(username) {
		let user = await client.getUserContext(username, true);
		if(!user) {
			throw new Error(util.format('User was not found :', username));
		} else {
			logger.debug('User %s was found to be registered and enrolled', username);
		}
	}
	logger.debug('getClientForOrg - ****** END %s %s \n\n', userorg, username)

	return client;
}

var getRegisteredUser = async function(username, userOrg, isJson) {
	try {
		var client = await getClientForOrg(userOrg);
		logger.debug('Successfully initialized the credential stores');
			// client can now act as an agent for organization Org1
			// first check to see if the user is already enrolled
		var user = await client.getUserContext(username, true);
		if (user && user.isEnrolled()) {
			logger.info('Successfully loaded member from persistence');
		} else {
			// user was not enrolled, so we will need an admin user object to register
			logger.info('User %s was not enrolled, so we will need an admin user object to register',username);
			var admins = hfc.getConfigSetting('admins');
			let adminUserObj = await client.setUserContext({username: admins[0].username, password: admins[0].secret});
			let caClient = client.getCertificateAuthority();
			let secret = await caClient.register({
				enrollmentID: username,
				affiliation: userOrg.toLowerCase() + '.department1'
			}, adminUserObj);
			logger.debug('Successfully got the secret for user %s',username);
			user = await client.setUserContext({username:username, password:secret});
			logger.debug('Successfully enrolled username %s  and setUserContext on the client object', username);
		}
		if(user && user.isEnrolled) {
			if (isJson && isJson === true) {
				var response = {
					success: true,
					secret: user._enrollmentSecret,
					message: username + ' enrolled Successfully',
				};
				return response;
			}
		} else {
			throw new Error('User was not enrolled ');
		}
	} catch(error) {
		logger.error('Failed to get registered user: %s with error: %s', username, error.toString());
		return 'failed '+error.toString();
	}

};


var setupChaincodeDeploy = function() {
	process.env.GOPATH = path.join(__dirname, hfc.getConfigSetting('CC_SRC_PATH'));
};

var getLogger = function(moduleName) {
	var logger = log4js.getLogger(moduleName);
	logger.setLevel('DEBUG');
	return logger;
};

var encrypt = function (text, masterkey) {
	// random initialization vector
	const iv = crypto.randomBytes(16);
  
	// random salt
	const salt = crypto.randomBytes(64);
  
	// derive key: 32 byte key length - in assumption the masterkey is a cryptographic and NOT a password there is no need for
	// a large number of iterations. It may can replaced by HKDF
	const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');
  
	// AES 256 GCM Mode
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
	// encrypt the given text
	const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  
	// extract the auth tag
	const tag = cipher.getAuthTag();
  
	// generate output
	return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

var decrypt = function (data, masterkey) {
    // base64 decoding
    const bData = new Buffer(data, 'base64');

    // convert data to buffers
    const salt = bData.slice(0, 64);
    const iv = bData.slice(64, 80);
    const tag = bData.slice(80, 96);
    const text = bData.slice(96);

    // derive key using; 32 byte key length
    const key = crypto.pbkdf2Sync(masterkey, salt, 2145, 32, 'sha512');

    // AES 256 GCM Mode
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    // encrypt the given text
    const decrypted = decipher.update(text, 'binary', 'utf8') + decipher.final('utf8');

    return decrypted;
};

const config = require('config');
const moment = require('moment');

var getTimestamp = function () {
    return moment.utc().format(config.dateFormat);
}
exports.getClientForOrg = getClientForOrg;
exports.getLogger = getLogger;
exports.setupChaincodeDeploy = setupChaincodeDeploy;
exports.getRegisteredUser = getRegisteredUser;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.getTimestamp = getTimestamp;
