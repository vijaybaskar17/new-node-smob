'use strict';

 var express = require('express');
 var router = express.Router();
 var cors = require('cors');
 var bodyParser = require('body-parser');
 var bcSdk = require('../invoke');
 var affiliation = 'supplyv11';

//exports is used here so that newRequest can be exposed for router and blockchainSdk file.
exports.newRequest = (requestid, status, InvolvedParties, transactionString) =>{
 return new Promise(async (resolve, reject) => {
  
        const newRequest = ({
            requestid: requestid,
            status: status,
            InvolvedParties: InvolvedParties,
            transactionString: transactionString,
        });
        
        
        await bcSdk.newRequest({UserDetails: newRequest })
       .then(() => resolve({
            status:200,
            message: 'resquest send successfully !'
        }))
        .catch(err => {

            if (err.code == 401) {

                reject({ "status": 401, "message": 'Request Already sent!' });

            } else {
                console.log("error occurred" + err);

                reject({ "status": 500, "message": 'Internal Server Error !' });
            }
        });
    });
}