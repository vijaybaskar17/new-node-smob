'use strict';

var express = require('express');
var router = express.Router();
var cors = require('cors');
var bodyParser = require('body-parser');
var bcSdk = require('../query');
var user = 'khetesh1';
var affiliation = 'supplyv11';
var startKey=startKey;
var endKey=endKey;


exports.readAllRequest = (startKey,endKey) => {
    
    return new Promise((resolve, reject) => {
        console.log("startKey---",startKey);
        console.log("endKey---",endKey);
        console.log("entering into readAllrequest function.......!")
        
        bcSdk.readAllRequest({
            startKey: startKey,
            endKey:endKey 
        })

        .then((requestarray) => {
            console.log("data in requestArray " + requestarray)

            return resolve({
                status: 200,
                query: requestarray
            })
        })

        .catch(err => {

            if (err.code == 401) {

                return reject({
                    status: 401,
                    message: 'cant fetch !'
                });

            } else {
                console.log("error occurred" + err);

                return reject({
                    status: 500,
                    message: 'Internal Server Error !'
                });
            }
        })
    })
};