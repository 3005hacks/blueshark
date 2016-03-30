/*

name: db.js
description: server-side code to access mongoDB database

*/

// contains simple set of assertion tests that can be used to test invariants
var assert = require('assert');

// these functions are used in app.js
module.exports = {

  // insert an object into the database
  insertDocument: function(db, className, mongoData, callback) {

    db.collection(className).insertOne(mongoData, function(err, result) {

      assert.equal(err, null);
      console.log("Inserted a document into the " + className + " collection.");
      callback();
    });
  },

  // find event object from database
  findDocument: function(db, className, attributeName, objectKey, callback) {

    db.collection(className).findOne({attributeName: objectKey}, function(err, result) {
      assert.equal(err, null);

      // if eventID IS found
      if (result != null) {
        callback(result);
      } 
      else {
        console.log("Nothing was found for: " + objectKey);
      }
    });
  }

};