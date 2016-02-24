var assert = require('assert');

module.exports = {

  // Insert an object into the database
  insertDocument: function(db, className, mongoData, callback) {

    db.collection(className).insertOne( mongoData, function(err, result) {

      assert.equal(err, null);
      console.log("Inserted a document into the events collection.");
      callback();
  });
},

findRestaurants: function(db, callback) {
   var cursor = db.collection('restaurants').find( );
   cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
    });
  }
};