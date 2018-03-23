// Initial express app setup
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

// Initial Mongo client setup
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://adampruner:mongodb218@ds117469.mlab.com:17469/cmpt218mongodb';
const dbName = 'cmpt218mongodb';

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {

  assert.equal(null, err);
  console.log('Connected to mongodb218@ds117469.mlab.com:17469/cmpt218mongodb');
  const db = client.db(dbName);
  console.log('db created, configuring express server now');
  findAdminUser(db, (admin) => {
    if (!admin) {
      insertAdminUser(db, () => {
        nodeSetup(db);
      })
    } else {
      nodeSetup(db);
    }
  });
});

const nodeSetup = (db) => {
  app.use(bodyParser.json());

  app.get('/logins', (req, res) => {
    res.send({ express: 'Login received, hello from the server side!' });
  });

  app.post('/logins', (req, res) => {
    console.log('login received, here are the username and password');
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    findAdminUser(db, (doc) => {
      if (username === doc.username && password === doc.password) {
        res.send({
          loginMessage: 'Login successful!',
          loginSuccess: true
        });
      } else {
        res.send({
          loginMessage: 'Login unsuccessful, either your username or password are incorrect!',
          loginSuccess: false
        });
      }
    })
  });

  app.listen(port, () => console.log('Listening on port ', port));
};

const insertAdminUser = (db, callback) => {
  const collection = db.collection('users');
  collection.insertOne({
    username: 'Admin',
    password: 'foobar'
  }, (err, result) => {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log('Admin user created in users collection');
    callback(result);
  });
};

const findAdminUser = (db, callback) => {
  const collection = db.collection('users');
  collection.findOne({
    username: 'Admin',
    password: 'foobar'
  }, (err, doc) => {
    assert.equal(err, null);
    console.log('Admin user found');
    console.log(doc);
    callback(doc);
  });
};

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
