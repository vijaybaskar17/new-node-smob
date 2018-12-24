'use strict';

const request = require('../models/requestid');

exports.saveRequestId = (requestid,randomNo1) =>{return new Promise((resolve, reject) => {
    console.log("requestid1 in savereq"+requestid)

   
    request.findOneAndUpdate({
        requestid: randomNo1
    }, {
        $set: {
            requestid: requestid
           
        }
}, {new: true}).then((requests) => 

{
    console.log("requests"+requests)
    resolve({status: 201, requests: requests._doc.requestid})


})
        .catch(err => {

            if (err.code == 11000) {

                reject({status: 409, message: 'User Already Registered !'});

            } else {

                reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});
}