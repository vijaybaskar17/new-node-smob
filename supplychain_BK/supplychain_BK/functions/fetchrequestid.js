'use strict';

const request = require('../models/requestid');

exports.fetchrequestid = (user) => new Promise((resolve, reject) => {
    

   
    request
    .find().then((requests) => resolve({status: 201, requests: requests[0].requestid}))
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'request not fetched '});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});
