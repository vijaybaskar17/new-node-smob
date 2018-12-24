'use strict';
/*
 * Copyright IBM Corp All Rights Reserved
 *
 * SPDX-License-Identifier: Apache-2.0
 */
/*
 * Hyperledger Fabric Sample Query Program
 */

var hfc = require('fabric-client');
var path = require('path');

var options = {
    wallet_path: path.join(__dirname, './hfc-key-store'),
    user_id: 'admin',
    channel_id: 'mychannel',
    chaincode_id: 'supplyv11',
    network_url_1: 'grpc://localhost:8051',
    network_url_2:'grpc://localhost:9051'
};

var channel = {};
var client = null;
var store_path = path.join(__dirname, './hfc-key-store');
console.log("Create a client and set the wallet location",store_path);

function readIndex(params) {
    console.log(params, 'data in params for query method')
    return Promise.resolve().then(async () => {
        console.log("Create a client and set the wallet location");
        client = new hfc();
        var wallet =await hfc.newDefaultKeyValueStore({
            path: options.wallet_path
        });
   
        console.log("Set wallet path, and associate user ", options.user_id, " with application");
        client.setStateStore(wallet);
            var crypto_suite = hfc.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = hfc.newCryptoKeyStore({ path: store_path });
            crypto_suite.setCryptoKeyStore(crypto_store);
            client.setCryptoSuite(crypto_suite);
            var user1 = await client.getUserContext(options.user_id, true);
            console.log(user1)
    }).then((user) => {
        console.log("Check user is enrolled, and set a query URL in the network");
        if (user === undefined || user.isEnrolled() === false) {
            console.error("User not defined, or not enrolled - error");
        }
        channel = client.newChannel(options.channel_id);
        channel.addPeer(client.newPeer(options.network_url));
        // channel.addPeer(client.newPeer(options.network_url_2));
        return;
    }).then(() => {
        console.log("Make query");
        var transaction_id = client.newTransactionID();
        console.log("Assigning transaction_id: ", transaction_id._transaction_id);

        // queryCar - requires 1 argument, ex: args: ['CAR4'],
        // queryAllCars - requires no arguments , ex: args: [''],
        const request = {
            chaincodeId: options.chaincode_id,
            txId: transaction_id,
            fcn: 'readIndex',
            args: ['index']
        };
        return channel.queryByChaincode(request);
    }).then((query_responses) => {
        console.log("returned from query");
        if (!query_responses.length) {
            console.log("No payloads were returned from query");
        } else {
            console.log("Query result count = ", query_responses.length)
        }
        if (query_responses[0] instanceof Error) {
            console.error("error from query = ", query_responses[0]);
        }
        console.log("lol" + query_responses[0].toString());
        var array = JSON.parse(query_responses[0].toString());
        return array

    }).catch((err) => {
        console.error("Caught Error", err);
    });
}

function readRequest(params) {
    console.log(params, 'data in params for query method')
    return Promise.resolve().then(async () => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            var wallet=await hfc.newDefaultKeyValueStore({
                path: options.wallet_path
            });
        
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            var crypto_suite = hfc.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = hfc.newCryptoKeyStore({ path: store_path });
            crypto_suite.setCryptoKeyStore(crypto_store);
            client.setCryptoSuite(crypto_suite);
            var user1 = await client.getUserContext(options.user_id, true);
            console.log(user1)
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            channel.addPeer(client.newPeer(options.network_url_1));
            channel.addPeer(client.newPeer(options.network_url_2));
            return;
        }).then(() => {
            console.log("Make query");
            var requestid = params.requestid;
            console.log("request >-------->" + requestid);
            var transaction_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", transaction_id._transaction_id);

            // queryCar - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars - requires no arguments , ex: args: [''],
            const request = {
                chaincodeId: options.chaincode_id,
                txId: transaction_id,
                fcn: 'readRequest',
                args: [requestid]
            };
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
            if (!query_responses.length) {
                console.log("No payloads were returned from query");
            } else {
                console.log("Query result count = ", query_responses.length)
               
            }
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            }
            console.log("lol:" + query_responses[0].toString());
            return JSON.parse(query_responses[0].toString());
            

        }).catch((err) => {
            console.error("Caught Error", err);
        });
}

function readAllRequest(params) {
    console.log(params, 'data in params for query method')
    return Promise.resolve().then(async() => {
            console.log("Create a client and set the wallet location");
            client = new hfc();
            var wallet=await hfc.newDefaultKeyValueStore({
                path: options.wallet_path
            });
       
            console.log("Set wallet path, and associate user ", options.user_id, " with application");
            client.setStateStore(wallet);
            var crypto_suite = hfc.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            var crypto_store = hfc.newCryptoKeyStore({ path: store_path });
            crypto_suite.setCryptoKeyStore(crypto_store);
            client.setCryptoSuite(crypto_suite);
            var user1 = await client.getUserContext(options.user_id, true);
            console.log(user1)
        }).then((user) => {
            console.log("Check user is enrolled, and set a query URL in the network");
            if (user === undefined || user.isEnrolled() === false) {
                console.error("User not defined, or not enrolled - error");
            }
            channel = client.newChannel(options.channel_id);
            channel.addPeer(client.newPeer(options.network_url_1));
        channel.addPeer(client.newPeer(options.network_url_2));
            return;
        }).then(() => {
            console.log("Make query");
            var startKey = (params.startKey).toString();
            console.log("request >-------->" + startKey);
            var endKey = (params.endKey).toString();
            console.log("request >-------->" + endKey);
           var transaction_id = client.newTransactionID();
            console.log("Assigning transaction_id: ", transaction_id._transaction_id);

            // queryCar - requires 1 argument, ex: args: ['CAR4'],
            // queryAllCars - requires no arguments , ex: args: [''],
            const request = {
                chaincodeId: options.chaincode_id,
                txId: transaction_id,
                fcn: 'readAllRequest',
                args: [startKey,endKey]
            };
            return channel.queryByChaincode(request);
        }).then((query_responses) => {
            console.log("returned from query");
            if (!query_responses.length) {
                console.log("No payloads were returned from query");
            } else {
                console.log("Query result count = ", query_responses.length)
               
            }
            if (query_responses[0] instanceof Error) {
                console.error("error from query = ", query_responses[0]);
            }
            console.log("lol:" +JSON.parse(query_responses[0].toString()));
            return JSON.parse(query_responses[0].toString());
            

        }).catch((err) => {
            console.error("Caught Error", err);
        });
}
module.exports = {
    readIndex: readIndex,
    readRequest: readRequest,
    readAllRequest:readAllRequest
};

