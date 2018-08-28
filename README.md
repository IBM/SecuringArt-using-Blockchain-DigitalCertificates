


# Securing Artwork using Blockchain Digital Certificates

In this Code Pattern, This is a sample auction Node.js based application, that demonstrates storing base64 encoded and encrypted image on to Blockchain ledger and retrieve the same.This application launches Hyperledger Fabric network, aswell starts the application as REST API server built on top of NodeSDK APIs. 

**Auction Blockchain Application Credits**: Mohan Venkataraman, Sandeep Pulluru and Ratnakar Asara

**Disclaimer**: The image used in this sample demo have been downloaded from publicly available images on the internet, and the copyright belongs to the respective owners. The usage here is strictly for non-commercial purposes as sample data. We recommend that users create their own sample data as appropriate. All details used in the sample data are fictitous. The information provided in this README.md is subject to change. Also this is based out of fabric-sample balance-transafer example.

When the reader has completed this Code Pattern, they will understand how to:

* Set up a Blockchain network
* Generate a base64 encrypted image and store it on the blockchain ledger
* Query chaincode to retrieve image and store it in a public folder


<!--Remember to dump an image in this path-->
![](doc/source/images/architecture.png)

## Flow
<!--Add new flow steps based on the architecture diagram-->
1. Teardown any existing networks, remove any existing containers or images lying around
2. Launch the Hyperledger Fabric network
3. Launch the Node.js application (Rest Server wrapper of top of the NodeSDK API)
4. Create the channel myChannel
5. Install and instantiate the auction chaincode
6. Invoke a transaction where the Node.js app transforms a base 64 encrypted image to a string format 
7. Chaincode calls a smart contract that stores the image on the Blockchain ledger
5. Query chaincode to gether the image data by its imageID and save the image as a Thumbnail in a public folder

<!--Update this section-->
## Prerequisites
* Docker - 17.09.x or higher
* Docker Compose - 1.16.1 or higher
* Node.js v8.4.0 or higher
* [jq] (https://stedolan.github.io/jq/)

<!--Update this section-->
## Included components
* [Hyperledger Composer v0.19.4](https://hyperledger.github.io/composer/latest/) Hyperledger Composer is an extensive, open development toolset and framework to make developing blockchain applications easier
* [Hyperledger Fabric v1.1](https://hyperledger-fabric.readthedocs.io) Hyperledger Fabric is a platform for distributed ledger solutions, underpinned by a modular architecture delivering high degrees of confidentiality, resiliency, flexibility and scalability.

<!--Update this section-->
## Featured technologies
Select components from [here](https://github.ibm.com/developer-journeys/journey-docs/tree/master/_content/dev#technologies), copy and paste the raw text for ease
* [jq] (https://stedolan.github.io/jq/): description
* [Docker](link): 17.09.x or higher
* [Docker Compose](link): 1.16.1 or higher
* [Node.js](link): v8.4.0 or higher
* [Technology](link): description

## Steps
1. [Clone the repo](#1-clone-the-repo)
2. [Launch Hyperledger Fabric Network and Node App](#2-launch-hyperledger-fabric-network-and-node-app)
3. [Create the Network Channel and Invoke a Transaction](#3-Create-the-Network-Channel-and-Invoke-a-Transaction)


### Step 1. Clone the repo

Clone the `SecuringArt-using-Blockchain-DigitalCertificates` repo locally. In a terminal, run:

```
git clone https://github.com/IBM/SecuringArt-using-Blockchain-DigitalCertificates.git
```

### Step 2. Launch Hyperledger Fabric Network and Node App

In one terminal launch hyperledger fabric network and Node.js application (a REST Server wrapper on top of Fabric NodeSDK api)  with the following command
```
cd SecuringArt-using-Blockchain-DigitalCertificates
./bootstrap_app.sh 
```

### Step 3. Create the Network Channel and Invoke a Transaction
In another terminal issue the following command from auction directory.
```
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


# Links

* [IBM Blockchain - Marbles demo](https://github.com/IBM-Blockchain/marbles)
* [Hyperledger Composer](https://hyperledger.github.io/composer/latest/index.html)


# Learn more

* **Blockchain Code Patterns**: Enjoyed this Code Pattern? Check out our other [Blockchain Code Patterns](https://developer.ibm.com/code/technologies/blockchain/)

* **Blockchain 101**: Learn why IBM believes that blockchain can transform businesses, industries – and even the world. [Blockchain 101](https://developer.ibm.com/code/technologies/blockchain/)

# License
[Apache 2.0](LICENSE)