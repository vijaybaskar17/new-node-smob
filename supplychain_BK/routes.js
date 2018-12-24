//here only routing is done
'use strict';
const newRequest = require('./functions/newRequest');
const updateRequest = require('./functions/updateRequest');
const updateQuantity = require('./functions/updateQuantity');
const readRequest = require('./functions/readRequest');
const saverequest = require('./functions/saverequestid');
const fetchrequestid = require('./functions/fetchrequestid');
const fetchinventory = require('./functions/fetchinventory');
const readIndex = require('./functions/readIndex');
const readAllRequest = require('./functions/readAllRequest');
const getInventory = require('./functions/getInventory');
const cors = require('cors');
const nodemailer = require('nodemailer');
var request = require('request-promise');
var mongoose = require('mongoose');
var image = require('./models/documents');
var dateTime = require('node-datetime');
var path = require('path');
var cloudinary = require('cloudinary').v2;
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var crypto = require('crypto');
var express = require('express');
var cfenv = require('cfenv');
var Promises = require('promise');

module.exports = router => {
    // file upload API
    cloudinary.config({
        cloud_name: 'rapidqubedigi',
        api_key: '247664843254646',
        api_secret: 'NNP88tw2YEBofSww9bPK7AV9Jc0'

    });
    var randomNo1 = 0;
    // weather API key
    var apiKey = '6ebeec1ed5f648e88de55743172109';

    // Iot Data Thingworks 
    router.get('/location', cors(), (req, res1) => {
        console.log("entering into IOT function ");

        var options = {
            url: 'https://academic.cloud.thingworx.com/Thingworx/Things/GpsTracker_kheteshrotangan/Properties?appKey=d50144fb-8674-44ea-83d4-aca709204753',
            method: 'GET',
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                'Accept': 'application/json'
            },

        };
        request(options, function(err, result, body) {
            if (result && (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 401 || result.statusCode === 402 || result.statusCode === 404)) {
                var mydata = JSON.parse(result.body)

                res1.status(result.statusCode).json({

                    data: mydata.rows,

                })
            }

        });

    });
    // registerUser - routes user input to Regestration API.
    router.post('/registerUser', cors(), (req, res1) => {
        console.log("entering register function ");

        const email_id = req.body.email;

        console.log(email_id);
        const password_id = req.body.password;
        console.log(password_id);
        const userObjects = req.body.userObject;
        console.log(userObjects);
        const usertype_id = req.body.usertype;
        console.log(usertype_id);
        var json = {
            "email": email_id,
            "password": password_id,
            "userObject": userObjects,
            "usertype": usertype_id
        };

        var options = {
            url: 'https://apidigi.herokuapp.com/registerUser',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };


        if (!email_id || !password_id || !usertype_id) {

            res1.status(400).json({
                message: 'Invalid Request !'
            });

        } else {

            request(options, function(err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 409)) {

                    res1.status(res.statusCode).json({
                        message: body.message
                    })
                }

            });
        }
    });

    // login -  routes user input to login API.
    router.post('/login', cors(), (req, res1) => {
        console.log("entering login function ");

        const emailid = req.body.email;
        console.log(emailid);
        const passwordid = req.body.password;
        console.log(passwordid);

        var json = {
            "email": emailid,
            "password": passwordid,

        };

        var options = {
            url: 'https://apidigi.herokuapp.com/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: json
        };


        if (!emailid || !passwordid) {

            res1.status(400).json({
                message: 'Invalid Request !'
            });

        } else {


            request(options, function(err, res, body) {
                if (res && (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 401 || res.statusCode === 402 || res.statusCode === 404)) {

                    res1.status(res.statusCode).json({
                        message: body.message,
                        token: body.token,
                        usertype: body.usertype,
                        userdetails: body.userDetails


                    })
                }

            });
        }
    });

    //newRequest -  routes user input to function newRequest. 
    router.post("/newRequest", (req, res) => {
        // console.log("Routing User Input to newRequest Function.....!")
        // var random_no = "";
        // var possible = "0123456789";
        // for (var i = 0; i < 4; i++)
        // random_no += possible.charAt(Math.floor(Math.random() * possible.length));


        var status = JSON.stringify(req.body.status);
        console.log("status" + status);
        var InvolvedParties = JSON.stringify(req.body.InvolvedParties);
        console.log("InvolvedParties" + InvolvedParties);
        var transactionString = JSON.stringify(req.body.transactionString);
        console.log("transactionString" + transactionString);
        var user = "user"
        var randomNo1;
        var requestno;
        var promise = new Promises(function(resolve, reject) {
            fetchrequestid
                .fetchrequestid(user)
                .then(function(result) {
                    randomNo1 = result.requests
                    console.log("randomNo1" + randomNo1);
                    resolve(randomNo1);

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        });
        promise.then(function(randomNo1) {
            var randomno = randomNo1 + 1
            var requestid1 = randomno;
            console.log("requestid--*******----" + requestid1);
            saverequest
                .saveRequestId(requestid1, randomNo1)
                .then(function(result) {
                    requestno = result.requests

                    resolve(requestno);

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        });



        promise.then(function(requestno) {
            var requestid = requestno.toString();
            console.log("requestid in ledger" + requestid);
            newRequest.newRequest(requestid, status, InvolvedParties, transactionString)

                .then(result => {
                    res.status("200").json({
                        message: result.message

                    })
                })

                // .catch(err => res.status(err.status).json({
                //     message: err.message
                // }));
        });


    });


    router.post("/updateRequest", (req, res) => {
        console.log("Routing User Input to updateRequest Function.....!")
        var total, message1;

        const requestid1 = checkToken(req);

        const requestid = requestid1;
        var status = req.body.status;
        var InvolvedParties = req.body.InvolvedParties;
        var transactionString = req.body.transactionString;
        var itemname = req.body.transactionString.materialtype;
        var number;
        var quantity = parseInt(req.body.transactionString.Quantity);

        return new Promise((resolve, reject) => {
            readRequest.readRequest(requestid)
                .then((result) => {
                    console.log("lol----", result.query);
                    if (result.query.transactionlist[0].transactiondetails.status === "RequestInitiated" && result.query.transactionlist[0].transactiondetails.updatedby === "Manufacturer" && status === "DoDelievered") {
                        number = 1;
                        

                            fetchinventory.fetchinventory(itemname, quantity, number)
                                .then((results) => {

                                    updateQuantity.updateQuantity(itemname, results.total)
                                        .then(Fresult => {

                                            updateRequest.updateRequest(requestid, status, transactionString)

                                                .then(result => {
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "message": "REQUEST UPDATED",
                                                            "status": "success"
                                                        });
                                                })
                                        })
                                })
                                .catch(err => res.status(500).json({
                                    message: err.message
                                }));

                       

                    } else if (result.query.transactionlist[0].transactiondetails.status === "RequestInitiated" && result.query.transactionlist[0].transactiondetails.updatedby === "retailer" && status === "DoDelievered") {
                        number = 2;
                                       

                            fetchinventory.fetchinventory(itemname, quantity, number)
                                .then((results) => {

                                    updateQuantity.updateQuantity(itemname, results.total)
                                        .then(Fresult => {

                                            updateRequest.updateRequest(requestid, status, transactionString)

                                                .then(result => {
                                                    res
                                                        .status(200)
                                                        .json({
                                                            "message": "REQUEST UPDATED",
                                                            "status": "success"
                                                        });
                                                })
                                        })
                                })
                                .catch(err => res.status(500).json({
                                    message: err.message
                                }));

                        
                    } else {
                      
                                updateRequest.updateRequest(requestid, status, transactionString)

                                    .then(result => {
                                         res
                                                        .status(200)
                                                        .json({
                                                            "message": "REQUEST UPDATED",
                                                            "status": "success"
                                                        });

                                    })
                                    .catch(err => res.status(500).json({
                                        message: err.message
                                    }))

                    }

                }).catch(err => res.status(500).json({
                    message: err.message
                }));

        })
    })



    // readRequest - query fetches user input given by user for newRequest.
    var readAlldata = [];
    var requestList = [];
    router.get("/readRequest", (req, res) => {
        //    var requestList = [];

        if (1 == 1) {

            const requestid1 = checkToken(req);
            console.log("requestid1", requestid1);
            const requestid = requestid1;


            readRequest.readRequest(requestid)
                .then(function(result) {
                    readAlldata = result.query;
                    console.log("readAlldata ---", readAlldata);
                    return res.json({
                        "status": 200,
                        "message": result.query
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });

    // console.log("requestList",requestList);
    // readIndex - query fetches user input given by user for newRequest.
    router.get("/readIndex", cors(), (req, res) => {

        if (1 == 1) {

            readIndex.readIndex({
                    "user": "khetesh",
                    "getusers": "getusers"
                })
                .then(function(result) {
                    var firstrequest = result.query[0]
                    console.log("firstrequest--", firstrequest);
                    var mylength = result.query.length;
                    var lastrequest = result.query[mylength - 1];
                    console.log("lastrequest--", lastrequest);
                    if (requestList.length === 0) {
                        requestList.push(firstrequest);
                        requestList.push(lastrequest);
                        console.log("requestList ---1", requestList);
                    }
                    console.log("requestList", requestList);
                    return res.json({
                        "status": 200,
                        "message": requestList
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });

    //----read allrequest
    var readAlldata = [];
    router.get("/readAllrequest", cors(), (req, res) => {
        //var requestList = [];
        console.log("requestList ----readAllrequest", requestList);
        if (1 == 1) {
            //  const startKey = checkToken(req);
            //const endKey = checkToken1(req);     
            if (requestList !== []) {
                var startKey = parseInt('0000');
                console.log("startKey", startKey);
                var endKey = 2 + parseInt(requestList[1].requestid);
                console.log("endKey--", endKey);

            }
            readAllRequest.readAllRequest(startKey, endKey)
                .then(function(result) {

                    console.log("  result.query---->", result.query);
                    return res.json({
                        "status": 200,
                        "message": result.query
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });
    router.get("/getInventory", cors(), (req, res) => {

        if (1 == 1) {


            getInventory.getInventory({
                    "user": "khetesh",
                    "getusers": "getusers"
                })

                .then(function(result) {

                    return res.json({
                        "status": 200,
                        "message": result.query
                    });

                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }

    })

    router.get("/readStatus", cors(), (req, res) => {
        var statusList = [];
        console.log("readstatus routes");
        if (1 == 1) {

            if (requestList !== []) {
                var startKey = parseInt('0000');
                console.log("startKey", startKey);
                var endKey = 2 + parseInt(requestList[1].requestid);
                console.log("endKey--", endKey);

            }
            readAllRequest.readAllRequest(startKey, endKey)

                .then(function(result) {
                    console.log("result", result);
                    console.log("length====", result.query.length);
                    console.log("jujujuju----", result.query[0].Record.transactionlist[0].transactiondetails.status);

                    for (let i = 0; i < result.query.length; i++) {
                        console.log("for 1")
                        console.log("dddd---", result.query[i].Record.transactionlist[0]);
                        for (let j = 0; j < result.query[i].Record.transactionlist.length; j++) {
                            console.log("for2");
                            if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestInitiated" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestAccepted" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationAccepted" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "purchaseorderRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "deliveryorderRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "Shipped" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "DeliveryOrderDelievered" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceApproved" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentInitiated" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceDecline" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentReceived" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestRejected" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "quotationRejected" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "Completed") {
                                if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestInitiated") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestAccepted") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestRejected") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationRaised") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationAccepted") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "quotationRejected") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "purchaseorderRaised") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "deliveryorderRaised") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "Shipped") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "DeliveryOrderDelievered") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceRaised") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceApproved") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceDecline") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentInitiated") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentReceived") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "Completed") {
                                    statusList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                    console.log(statusList)
                                } else {
                                    console.log("bada else kuch nai aaya")
                                }
                            } else {
                                console.log("main kuch nai aaya")
                            }


                            var countstatus = count(statusList);
                            console.log("countstatus" + JSON.stringify(countstatus[0].statuscount));
                        }
                    }
                    return res.json({
                        "status": 200,
                        statuscount: countstatus,
                        //  open:open,
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });
    router.get("/readCycle", cors(), (req, res) => {
        var OpenList = [];
        var ClosedList = [];
        if (1 == 1) {

            if (requestList !== []) {
                var startKey = parseInt('0000');
                console.log("startKey", startKey);
                var endKey = 2 + parseInt(requestList[1].requestid);
                console.log("endKey--", endKey);

            }
            readAllRequest.readAllRequest(startKey, endKey)

                .then(function(result) {

                    for (let i = 0; i < result.query.length; i++) {

                        for (let j = 0; j < result.query[i].Record.transactionlist.length; j++) {
                            if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestInitiated" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestAccepted" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationAccepted" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "purchaseorderRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "deliveryorderRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "Shipped" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "DeliveryOrderDelievered" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceRaised" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceApproved" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentInitiated" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceDecline" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentReceived" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestRejected" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "quotationRejected" ||
                                result.query[i].Record.transactionlist[j].transactiondetails.status == "Completed") {

                                if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestInitiated") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestAccepted") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationRaised") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "QuotationAccepted") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "purchaseorderRaised") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "deliveryorderRaised") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "Shipped") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "DeliveryOrderDelievered") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceRaised") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceApproved") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentInitiated") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "invoiceDecline") {
                                    OpenList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "paymentReceived") {
                                    ClosedList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "RequestRejected") {
                                    ClosedList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "quotationRejected") {
                                    ClosedList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                } else if (result.query[i].Record.transactionlist[j].transactiondetails.status == "Completed") {
                                    ClosedList.push(result.query[i].Record.transactionlist[j].transactiondetails.status);
                                }
                            }

                            var countstatus = count(OpenList);
                            var countstatus1 = count(ClosedList);
                            var Ostatus = [];
                            var CStatus = [];
                            for (let i = 0; i < countstatus.length; i++) {
                                (Ostatus.push(countstatus[i].statuscount))
                            }
                            for (let a = 0; a < countstatus1.length; a++) {
                                console.log("line 399", countstatus1.length);
                                console.log(countstatus1[a]);
                                console.log(countstatus1[a].statuscount);
                                (CStatus.push(countstatus1[a].statuscount))
                                console.log(CStatus);
                            }
                            var sum = Ostatus.reduce((a, b) => a + b, 0);
                            console.log("Ostatus", sum);
                            var sum1 = CStatus.reduce((a, b) => a + b, 0);
                            console.log("CStatus", sum1);
                        }
                    }

                    return res.json({
                        "status": 200,
                        openStatus: sum,
                        closedStatus: sum1
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": 401,
                message: 'cant fetch data !'
            });
        }
    });
    //to filter get purchase order request for tracking
    // var trackingdata =[];
    router.get("/readtrackingdata", cors(), (req, res) => {
        console.log("requestList ----readAllrequest", requestList);
        var trackingdata = [];
        if (1 == 1) {
            if (requestList !== []) {
                var startKey = parseInt('0000');
                console.log("startKey", startKey);
                var endKey = 2 + parseInt(requestList[1].requestid);
                console.log("endKey--", endKey);

            }
            readAllRequest.readAllRequest(startKey, endKey)
                .then(function(result) {
                    console.log("result.query", result.query.length);
                    for (let i = 0; i < result.query.length; i++) {
                        console.log("in for1");
                        console.log(result.query[i].Record.transactionlist, "=======pppfgoijrgi");
                        for (let j = 0; j < result.query[i].Record.transactionlist.length; j++) {

                            var mystatus = result.query[i].Record.transactionlist[j].transactiondetails.status;
                            console.log(mystatus, "=======mystatus");
                            if (mystatus === "purchaseorderRaised") {
                                console.log("in if");
                                trackingdata.push(result.query[i]);

                                console.log("trackingdata" + trackingdata);
                                console.log("in if");
                            }
                            /*else{
                                               return res.json({
                                                   "status": 200,
                                                   "data":"No request available"
                                               });

                                              }*/
                        }

                    }

                    return res.json({
                        "status": 200,
                        "data": trackingdata
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });
    //delivery order overview
     router.get("/readdeliveryOrder", cors(), (req, res) => {
        console.log("requestList ----readAllrequest", requestList);
        var trackingdata = [];
        if (1 == 1) {
            if (requestList !== []) {
                var startKey = parseInt('0000');
                console.log("startKey", startKey);
                var endKey = 2 + parseInt(requestList[1].requestid);
                console.log("endKey--", endKey);

            }
            readAllRequest.readAllRequest(startKey, endKey)
                .then(function(result) {
                    console.log("result.query", result.query.length);
                    for (let i = 0; i < result.query.length; i++) {
                        console.log("in for1");
                        console.log(result.query[i].Record.transactionlist, "=======from read delivery");
                        for (let j = 0; j < result.query[i].Record.transactionlist.length; j++) {

                            var mystatus = result.query[i].Record.transactionlist[j].transactiondetails.status;
                            console.log(mystatus, "=======mystatus");
                            if (mystatus === "deliveryorderRaised") {
                                console.log("in if");
                                trackingdata.push(result.query);

                                console.log("trackingdata" + trackingdata);
                                console.log("in if");
                            }
                            /*else{
                                               return res.json({
                                                   "status": 200,
                                                   "data":"No request available"
                                               });

                                              }*/
                        }

                    }

                    return res.json({
                        "status": 200,
                        "data": trackingdata
                    });
                })
                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        } else {
            res.status(401).json({
                "status": false,
                message: 'cant fetch data !'
            });
        }
    });
    // uploadDocs - uploads files to cloudinary server.

    router.post('/UploadDocs', multipartMiddleware, cors(),function(req, res, next) {
        var url;
        console.log("req.files.image" + JSON.stringify(req.files));
        var imageFile = req.files.file.path;
        console.log("imageFile",imageFile);

        cloudinary.uploader.upload(imageFile, {
                tags: 'express_sample',
                resource_type :"raw"
            })

            .then(function(image) {
                console.log('** file uploaded to Cloudinary service');
                console.dir(image);
                url = image.url;


                return res.send({
                    url: url,
                    message: "files uploaded succesfully"
                })
            })
            .catch(err =>
             
             res.status(err.status).json({
               
                    message: "not sucess"
                }));

    })

    function filterstatus(status) {

        if (1 == 1) {


            readIndex.readIndex({
                    "user": "khetesh",
                    "getusers": "getusers"
                })

                .then(function(result) {


                    console.log("result" + result.query)
                    var statusfilter = [];


                    for (let i = 0; i < result.query.status.length; i++) {
                        console.log("status" + status);
                        console.log("statusledger" + result.query[i].status);
                        if (result.query[i].status === status) {

                            statusfilter.push(result.query[i].status);
                            console.log("statusfilter" + statusfilter);
                        }
                    }
                    return statusfilter;
                })

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {
            return res.status(401).json({
                message: 'cant fetch data !'
            });

        }
    }

    function count(arr) {
        var statusname = [],
            statuscount = [],
            prev;

        arr.sort();
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] !== prev) {
                statusname.push(arr[i]);
                statuscount.push(1);
            } else {
                statuscount[statuscount.length - 1]++;
            }
            prev = arr[i];
        }
        console.log("statusname" + statusname);
        var result = [];
        for (var status in statusname) {


            result.push({
                statusname: statusname[status],
                statuscount: statuscount[status]
            });
        }

        return result;

    }

    function checkToken(req) {

        const token = req.headers['authorization'];

        if (token) {

            try {
                (token.length != 0)
                return token
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }

    function checkToken1(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {
                (token.length != 0)
                return token
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }
    // --------------------------Weather API---------------------------------------

    //Security - helmet
    var helmet = require('helmet');

    //setup middleware
    var app = express();
    var ninetyDaysInMilliseconds = 7776000000;

    // get the app environment from Cloud Foundry
    var appEnv = cfenv.getAppEnv();
    var weather_host = appEnv.services["weatherinsights"] ?
        appEnv.services["weatherinsights"][0].credentials.url // Weather credentials passed in
        :
        "https://5812af4a-b400-446f-a639-c665700dcbed:hQ6sKnTyIr@twcservice.mybluemix.net"; // or copy your credentials url here for standalone

    function weatherAPI(path, qs, done) {
        var url = weather_host + path;
        console.log(url, qs);
        request({
            url: url,
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Accept": "application/json"
            },
            qs: qs
        }, function(err, req, data) {
            if (err) {
                done(err);
            } else {
                if (req.statusCode >= 200 && req.statusCode < 400) {
                    try {
                        done(null, JSON.parse(data));
                    } catch (e) {
                        console.log(e);
                        done(e);
                    }
                } else {
                    console.log(err);
                    done({
                        message: req.statusCode,
                        data: data
                    });
                }
            }
        });
    }

    router.get('/api/forecast/daily', function(req, res) {
        var weatherData = [];

        var geocode = (req.query.geocode || "19.075984,72.877656").split(",");
        weatherAPI("/api/weather/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/forecast/daily/7day.json", {
            units: req.query.units || "e",
            language: req.query.language || "en-US"
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.send(err).status(400);
            } else {
                console.log("10 days Forecast");
                for (let i = 0; i < result.forecasts.length; i++) {
                    weatherData.push({
                        "max_temp": result.forecasts[i].max_temp,
                        "min_temp": result.forecasts[i].min_temp,
                        "narrative": result.forecasts[i].narrative,
                        "Day": result.forecasts[i].dow
                    })
                }
                res.json(weatherData);
            }
        });
    });

    router.get('/api/forecast/daily/3days', function(req, res) {
        var weatherData = [];

        var geocode = (req.query.geocode || "19.075984,72.877656").split(",");
        weatherAPI("/api/weather/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/forecast/daily/3day.json", {
            units: req.query.units || "e",
            language: req.query.language || "en-US"
        }, function(err, result) {
            if (err) {
                console.log(err);
                res.send(err).status(400);
            } else {
                console.log("3 days Forecast");
                for (let i = 0; i < result.forecasts.length; i++) {
                    weatherData.push({
                        "max_temp": result.forecasts[i].max_temp,
                        "min_temp": result.forecasts[i].min_temp,
                        "narrative": result.forecasts[i].narrative,
                        "Day": result.forecasts[i].dow
                    })
                }
                res.json(weatherData);
            }
        });
    });

    router.get('/api/forecast/hourly', function(req, res) {
        var geocode = (req.query.geocode || "19.075984,72.877656").split(",");
        weatherAPI("/api/weather/v1/geocode/" + geocode[0] + "/" + geocode[1] + "/forecast/hourly/48hour.json", {
            units: req.query.units || "m",
            language: req.query.language || "en"
        }, function(err, result) {
            if (err) {
                res.send(err).status(400);
            } else {
                console.log("24 hours Forecast");
                result.forecasts.length = 24; // we require only 24 hours for UI
                res.json(result);
            }
        });
    });
    //---------------new weather api-------
    router.post('/weatherdata', function(req, res) {
        var location1 = req.body.location;
        console.log(location1)
        const options = {
            method: 'POST',
            uri: 'https://api.openweathermap.org/data/2.5/weather?q=' + location1 + '&appid=ec00b38b419c8d7924c32f7fbe9ccbe9'
        }
        request(options)
            .then(function(response) {
                const data = (JSON.parse(response));

                res.status(200).json({
                    message: data

                });

            })
            .catch(err => res.status(500).json({
                message: err.message
            }))
    });

    //------------mock webservice for inventory details--------
    router.get("/mock/InventoryDetails", (req, res) => {



        res.send({

            "inventorydetails": [{
                    "itemname": "Engine blocks",
                    "currentquantity": "200",
                    "reorderquantity": "100"
                },
                {
                    "itemname": "Hex 24fastners",
                    "currentquantity": "300",
                    "reorderquantity": "100"
                },
                {
                    "itemname": "fuel hose",
                    "currentquantity": "300",
                    "reorderquantity": "100"
                },
                {
                    "itemname": "fuel tank",
                    "currentquantity": "400",
                    "reorderquantity": "100"
                },
                {
                    "itemname": "R123 tyres",
                    "currentquantity": "350",
                    "reorderquantity": "100"
                },
                {
                    "itemname": "Breakes",
                    "currentquantity": "300",
                    "reorderquantity": "100"
                },
                {
                    "itemname": "washers",
                    "currentquantity": "200",
                    "reorderquantity": "100"
                },


            ]

        })

    })
    //---------------------Mock Services For UI testing--------------------------

    // Login service for UI testing with predefined users.
    router.post("/mock/Login", (req, res) => {
        var email = req.body.email;
        var password = req.body.password;
        console.log(JSON.stringify(req.body))
        console.log(email);
        if (email === "man@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "Manufacturer"
            })
        } else if (email == "sup@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "Supplier"
            })
        } else if (email == "dis@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "Distributor"
            })
        } else if (email == "ret@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "retailer"
            })
        } else if (email == "log@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "logistics"
            })
        } else if (email == "bank@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "banker"
            })
        } else if (email == "ins@supply.com") {
            res.send({
                "message": "Login Successful",
                "status": true,
                "userType": "insurance"
            })
        }
    })

    // logout service for UI testing
    router.get("/mock/Logout", (req, res) => {

        res.send({
            "message": "Logout succesfully",
            "status": true

        })

    })
    // request service for NewRequest UI FORM 
    router.post("/mock/Request", (req, res) => {

        console.log(req.body);

        res.send({
            "message": "Request sent Successfully",
            "status": true,
            "details": req.body
        })


    })

    // updateRequest service for Update Request UI FORM
    router.post("/mock/Updaterequest", (req, res) => {
        console.log(req.body);
        res.send({
                "message": "updated your request",
                "status": true,
                "details": req.body
            }

        )
    })

    // update Transaction for transaction Update
    router.post("/mock/UpdateTransaction", (req, res) => {
        console.log(req.body);
        res.send({
                "message": "updated your request",
                "status": true,
                "details": req.body
            }

        )

    })
    // ReadTransaction returns dummy data data for the request.
    router.get("/mock/ReadTransaction", (req, res) => {



        res.send({

            "transactionlist": [{
                    "requesdid": "112",
                    "date": "01-may-2017",
                    "status": "PO raised"
                },
                {
                    "requesdid": "212",
                    "date": "04-may-2017",
                    "status": "Goods shipped"
                },
                {
                    "requesdid": "335",
                    "date": "07-may-2017",
                    "status": "Payment Initiated"
                }


            ]

        })

    })
    router.get("/mock/readStatus", (req, res) => {
        res.send({
            "statuscount": [{
                    "statusname": "DOraised",
                    "statuscount": 2
                },
                {
                    "statusname": "MaterialRequested",
                    "statuscount": 1
                },
                {
                    "statusname": "POraised",
                    "statuscount": 1
                },
                {
                    "statusname": "QuotationRejected",
                    "statuscount": 1
                }
            ],

        })


    })


    router.get("/mock/readCycle", (req, res) => {
        res.send({
            "openStatus": 4,
            "closedStatus": 1
        })
    })
    // readRequest service gives dummy data for the request
    router.get("/mock/Readrequest", (req, res) => {

        res.send({
            "requestno": "123809",
            "involved parties": ["mrf", "hundei", "fedex"],
            "transactionList": [{
                    "date": "2-may-2017-01:01:0000",
                    "updatedBy": "hundei",
                    "status": "Material request raised",
                    "intended-to": "mrf tyres",
                    "Quantity": "4000",
                    "deliverable required": "dec-2017"

                },
                {
                    "date": "3-may-2017-01:01:0000",
                    "updatedBy": "mrf",
                    "status": "Quotation raised",
                    "intended-to": "Hyundei",
                    "Quantity": "4000",
                    "cost": "500 per lot",
                    "last delivery": "dec-2017",
                    "delivery mode": "monthly",
                    "Attachment": "https://fileserver.org/?filename=xyz.pdf&fileid=3456"
                },
                {
                    "date": "4-may-2017-01:01:0000",
                    "updatedBy": "hyundei",
                    "status": "Purchase order raised",
                    "intended-to": "mrf tyres",
                    "Quantity": "4000",
                    "cost": "500 per lot",
                    "last delivery": "dec-2017",
                    "delivery mode": "monthly",
                    "Attachment": "https://fileserver.org/?filename=xyz.pdf&fileid=3456"
                }

            ]

        })



    })
}