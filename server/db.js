/*

name: db.js
description: server-side code to access mongoDB database

*/

// contains simple set of assertion tests that can be used to test invariants
var assert = require('assert');

// these functions are used in app.js
module.exports = {

  /**
  * This function inserts a new document into a given collection in the database
  * @param {mongo} db - the database provided in app.js
  * @param {String} className - the desired collection into which to be inserted
  * @param {Object} mongoData - the data to be stored
  * @param (function) callback - function to be executed after the current call
  */
  insertDocument: function(db, className, mongoData, callback) {

    // Navigate to the desired collection and insert the data
    db.collection(className).insertOne(mongoData, function(err, result) {

      // Check of there are any errors, if not, run the callback
      assert.equal(err, null);
      console.log("Inserted a document into the " + className + " collection.");
      callback();
    });
  },

  /**
  * This function retrieves an element from the database
  * @param {mongo} db - the database provided in app.js
  * @param {String} className - the desired collection from which to pull the data
  * @param {String} objectKey - the Facebook event ID for which to query
  * @param (function) callback - function to be executed after the current call
  */
  findDocument: function(db, className, attributeName, objectKey, callback) {

    var query = {};
    query[attributeName] = objectKey;

    db.collection(className).findOne(query, function(err, result) {
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