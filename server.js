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
    res.send({
      message: 'Hello from the server side!'
    });
  });

  app.post('/logins', (req, res) => {
    console.log('login POST request received, here are the username and password');
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    findAdminUser(db, (result) => {
      if (result && username === result.username && password === result.password) {
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

  app.get('/events', (req, res) => {
    console.log('event GET request received');
    console.log('request type is', req.headers.type);
    if (req.headers.type === 'deactivateEvent') {
      deactivateEvent(db, () => {
        res.send({
          eventMessage: 'Event successfully deactivated',
          eventSuccess: true
        });
      })
    } else if (req.headers.type === 'determineActive') {
      findActiveEvent(db, (result) => {
        if (!result) {
          res.send({
            eventMessage: 'There is no active event',
            eventCourseId: '',
            activeEventExists: false,
            eventSuccess: true
          });
        } else {
          res.send({
            eventMessage: 'There is an active event',
            eventCourseId: result.courseId,
            activeEventExists: true,
            eventSuccess: true
          });
        }
      });
    } else if (req.headers.type === 'fetchHistory') {
      findEventsByCourseId(db, req.headers.courseid, (results) => {
        if (results) {
          console.log('found events with that course ID, they are:', results);
          res.send({
            eventMessage: 'There was at least one event with this course ID found',
            events: results,
            eventSuccess: true
          })
        } else {
          res.send({
            eventMessage: 'There were no events with this course ID found',
            events: [],
            eventSuccess: true
          })
        }
      })
    }
  });

  app.post('/events', (req, res) => {
    console.log('event POST request received');
    const courseId = req.body.courseId;
    insertNewEvent(db, courseId, () => {
      res.send({
        eventMessage: 'New event created for course: ' + courseId,
        eventSuccess: true
      });
    });
  });

  app.get('/checkins', (req, res) => {
    console.log('checkin GET request received');
    res.send({
      message: 'Hello from the server side!'
    });
  });

  app.post('/checkins', (req, res) => {
    console.log('checkin POST request received');
    const checkIn = {
      checkInString: req.body.checkInString,
      name: req.body.name,
      userId: req.body.userId
    };
    checkInToCurrentActiveEvent(db, checkIn, (result) => {
      res.send({
        eventMessage: 'New checkin created for event id: ' + result.value.id,
        eventSuccess: true
      });
    });
  });

  app.listen(port, () => console.log('Listening on port', port));
};

const insertAdminUser = (db, callback) => {
  const collection = db.collection('users');
  collection.insertOne({
    username: 'admin',
    password: '1234'
  }, (err, result) => {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    assert.equal(1, result.ops.length);
    console.log('Admin user created in users collection');
    callback(result);
  });
};

const findEventsByCourseId = (db, courseId, callback) => {
  const collection = db.collection('events');
  console.log('CourseId is:', courseId);
  collection.find({courseId: courseId, active: false}).toArray((err, results) => {
    assert.equal(err, null);
    callback(results);
  })
};

const findAdminUser = (db, callback) => {
  const collection = db.collection('users');
  collection.findOne({
    username: 'admin',
    password: '1234'
  }, (err, result) => {
    assert.equal(err, null);
    callback(result);
  });
};

const checkInToCurrentActiveEvent = (db, checkIn, callback) => {
  const collection = db.collection('events');
  collection.findOneAndUpdate({active: true}, {$push: {checkIns: checkIn}}, {
    returnOriginal: false,
    upsert: true
  }, (err, result) => {
    assert.equal(err, null);
    callback(result);
  });
};

const findActiveEvent = (db, callback) => {
  const collection = db.collection('events');
  collection.findOne({active: true}, (err, result) => {
    assert.equal(err, null);
    callback(result)
  });
};

const insertNewEvent = (db, courseId, callback) => {
  const collection = db.collection('events');
  let newId = 1;
  collection.find({}).toArray((err, results) => {
    newId = results.length + 1;
    collection.insertOne({
      courseId: courseId,
      active: true,
      checkIns: [],
      id: newId
    }, (err, result) => {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      console.log('New event created in events collection, for course:', courseId);
      callback(result);
    });
  });
};

const deactivateEvent = (db, callback) => {
  const collection = db.collection('events');
  // There should only ever be one active event at a time in the events collection
  collection.findOneAndUpdate({active: true}, {$set: {active: false}}, {
    returnOriginal: false
  }, (err, result) => {
    assert.equal(err, null);
    assert.equal(false, result.value.active);
    callback(result);
  });
};
