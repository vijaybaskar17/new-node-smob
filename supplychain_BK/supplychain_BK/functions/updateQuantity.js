'use strict';

const invent = require('../models/inventory');

exports.updateQuantity = (itemname, total) =>{
    console.log("total in update qunatity",total)
return new Promise((resolve, reject) => {
    invent.findOneAndUpdate({
        itemname: itemname
    }, {
        $set: {
            'cuquantity': total
           
        }
}, {new: true}).then((requests) => 

{
    console.log("requests"+requests)
    resolve({status: 201, message: "quantity addded"})


})
        .catch(err => {

            if (err.code == 11000) {

             return   reject({status: 409, message: 'User Already Registered !'});

            } else {

              return  reject({status: 500, message: 'Internal Server Error !'});
            }
        });
});
}
