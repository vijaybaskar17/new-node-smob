'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inventorySchema = mongoose.Schema({

    itemname:String,
    cuquantity:Number,
    requantity:Number
   
});


mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/digitalId', { useMongoClient: true });
//mongoose.connect('mongodb://piyushap:piyu12345@ds155695.mlab.com:55695/smob', { useMongoClient: true });

mongoose.connect('mongodb://smob:smob12345@ds123258.mlab.com:23258/smob', { useMongoClient: true });

module.exports = mongoose.model('inventory', inventorySchema);