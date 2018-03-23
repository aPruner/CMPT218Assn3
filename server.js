// Initial express app setup
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express!' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

// Initial Mongo client setup
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://adampruner:mongodb218@ds117469.mlab.com:17469/cmpt218mongodb';

// Database Name
const dbName = 'cmpt218mongodb';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db, function() {
    indexCollection(db, function() {
      client.close();
    });
  });
});

// Mongodb quick start boilerplate for reference
// const insertDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// };
//
// const findDocuments = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Find some documents
//   collection.find({'a': 3}).toArray(function(err, docs) {
//     assert.equal(err, null);
//     console.log("Found the following records");
//     console.log(docs);
//     callback(docs);
//   });
// };
//
// const updateDocument = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Update document where a is 2, set b equal to 1
//   collection.updateOne({ a : 2 }
//     , { $set: { b : 1 } }, function(err, result) {
//       assert.equal(err, null);
//       assert.equal(1, result.result.n);
//       console.log("Updated the document with the field a equal to 2");
//       callback(result);
//     });
// };
//
// const removeDocument = function(db, callback) {
//   // Get the documents collection
//   const collection = db.collection('documents');
//   // Delete document where a is 3
//   collection.deleteOne({ a : 3 }, function(err, result) {
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     console.log("Removed the document with the field a equal to 3");
//     callback(result);
//   });
// };
//
// const indexCollection = function(db, callback) {
//   db.collection('documents').createIndex(
//     { "a": 1 },
//     null,
//     function(err, results) {
//       console.log(results);
//       callback();
//     }
//   );
// };
