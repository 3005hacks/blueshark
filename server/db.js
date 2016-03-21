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

    // JOSH
    db.collection(className).insertOne(mongoData, function(err, result) {
      // JOSH
      assert.equal(err, null);
      console.log("Inserted a document into the events collection.");
      callback();
    });
  },

  // find event object from database
  findEventByID: function(db, className, objectKey, callback) {

    // JOSH
    var cursor = db.collection(className).find({'eventID': objectKey});
    cursor.each(function(err, doc) {
      // JOSH
      assert.equal(err, null);

      // if eventID IS found
      if (doc != null) {
        console.log(doc);
      } 
      else {
        //callback("Nothing was found for this ID: " + objectKey);
      }
    });
  }
};