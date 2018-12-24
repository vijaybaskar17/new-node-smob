'use strict';

const invent = require('../models/inventory');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://piyushap:piyu12345@ds155695.mlab.com:55695/smob";

exports.getInventory = (params) => {
    return new Promise((resolve, reject) => {
        console.log("entering into getInventory function.....!")
        

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            //Find all documents in the customers collection:
        db.collection("inventories").find({}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);
            
            return resolve({
                        status: 201,                
                        query: result
                    })
            });
          })
    })
};