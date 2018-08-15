
**Auction Blockchain Application Credits**: Mohan Venkataraman, Sandeep Pulluru and Ratnakar Asara

**Disclaimer**: The image used in this sample demo have been downloaded from publicly available images on the internet, and the copyright belongs to the respective owners. The usage here is strictly for non-commercial purposes as sample data. We recommend that users create their own sample data as appropriate. All details used in the sample data are fictitous. The information provided in this README.md is subject to change. Also this is based out of fabric-sample balance-transafer example.

This is a sample auction Node.js based application, that demonstrates storing base64 encoded and encrypted image on to Blockchain ledger and retrieve the same.This application launches Hyperledger Fabric network, aswell starts the application as REST API server built on top of NodeSDK APIs. 

**Prerequisites and setup:**
* Docker - 17.09.x or higher
* Docker Compose - 1.16.1 or higher
* Node.js v8.4.0 or higher
* jq


**How to test the ene-to-end flow**


_Step1:_ Clone this repo
```
git clone https://github.com/ChainyardLabs/auction
```

_Step2:_ In one terminal launch hyperledger fabric network and Node.js application (a REST Server wrapper on top of Fabric NodeSDK api)  with the following command
```
cd auction
./bootstrap_app.sh 
```

_Step3:_ In another terminal issue the following command from auction directory.
```
cd auction
./quicktest.sh
```
The above script **quicktest.sh** performs the following actions:
* creates a *channel* named **mychannel** & and all the peers on the network *join*s the channel 
* *Installs* & *Instantiates* auction chaincode
* send an *Invoke transaction*. where Node.js app generates base64 encrypted image in to a string format and sends it to chaincode, then *auction chiancode* stores the image on the Blockchain ledger of the channel *mychannel*.
* Query chaincode to get the Image data using the imageID, the image will be saved as Thumbnail and saved in public/images folder.

For all the image processing & conversion refer the Node.js code [here](https://github.com/ChainyardLabs/auction/blob/master/app/saveImageTx.js)
Storing image using chaincode, refer the code snippet [here](https://github.com/ChainyardLabs/auction/blob/master/artifacts/src/github.com/auction/auction.go#L138-L168) 

Please check youtube video available here : https://goo.gl/jH1uCQ