var assert = require('assert');

module.exports = {

  // Insert an object into the database
  insertDocument: function(db, className, mongoData, callback) {

    db.collection(className).insertOne(mongoData, function(err, result) {

      assert.equal(err, null);

      console.log("Inserted a document into the events collection.");

      callback();
    });
  },

  // Find event object from database
  findEventByID: function(db, className, objectKey, callback) {
    console.log('finding event');
    var cursor = db.collection(className).find({'eventID': objectKey});

    cursor.each(function(err, doc) {

      assert.equal(err, null);

      // if eventID IS found
      if (doc != null) {
        callback(null, doc);
      } 
      else {
        callback("Nothing was found for this ID: " + objectKey);
      }
    });
  }
};