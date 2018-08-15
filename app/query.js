/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var path = require('path');
var fs = require('fs');
var util = require('util');
var hfc = require('fabric-client');
var helper = require('./helper.js');
var logger = helper.getLogger('Query');

var queryChaincode = async function(peer, channelName, chaincodeName, args, fcn, username, org_name) {
	try {
		// first setup the client for this org
		var client = await helper.getClientForOrg(org_name, username);
		logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
		var channel = client.getChannel(channelName);
		if(!channel) {
			let message = util.format('Channel %s was not defined in the connection profile', channelName);
			logger.error(message);
			throw new Error(message);
		}

		// send query
		var request = {
			targets : [peer], //queryByChaincode allows for multiple targets
			chaincodeId: chaincodeName,
			fcn: fcn,
			args: [args]
		};
		logger.info(request);
		let response_payloads = await channel.queryByChaincode(request);
		if (response_payloads) {
			return response_payloads[0].toString('utf8');
		} else {
			logger.error('response_payloads is null');
			return 'response_payloads is null';
		}
	} catch(error) {
		logger.error('Failed to query due to error: ' + error.stack ? error.stack : error);
		return error.toString();
	}
};

exports.queryChaincode = queryChaincode;
