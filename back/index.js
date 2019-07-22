const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const moment = require('moment');
const _ = require('underscore');
const PORT = 4000;
const authModel = require('./auth.model');
const celligenModel = require('./celligen.model');
const TransformDataCelligen = require('./TransformDataCelligen').transformDataCelligen;
const TransformDataExternal = require('./TransformDataExtenal').transformDataExternal;
const db = require('./database');
const privateKEY = fs.readFileSync('./.private.key', 'utf8');
const publicKEY = fs.readFileSync('./.public.key', 'utf8');

const signOptions = {
  expiresIn: "12h",
  algorithm: "RS256"
};

const verifyOptions = {
  expiresIn: "12h",
  algorithm: ["RS256"]
};

app.use(bodyParser.json({ limit: '5mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }))
app.use(cors());

db.once("open", () => console.log("connected to the database"));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/manip', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      celligenModel.find({}, {name:1, _id:1, dateStart:1, finish:1 }, (err, manip) => {
        if (err) {
          console.log(err);
        } else {
          res.json(manip);
        }
      });
    }
  });
});

app.get('/graph/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      if (req.params.id) {
        const manipId = req.params.id;
        celligenModel.findOne( { _id: manipId }, (err, manip) => {
          if (err) {
            console.log(err);
          } else {
            res.json(manip);
          }
        });
      }
    }
  });
});

app.post('/upload', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      celligenModel.findOne({ name: req.body[1] }, (err, manip) => {
        console.log(manip)
        if (err) {
          console.log(err);
        } else if (manip === null) {
          console.log('new name OK')
          res.sendStatus(200);
          const name = req.body[1];
          const files = req.body[2];
          const finish = req.body[0];
          const dateStart = req.body[4];
          {dateStart ? moment(dateStart).format('YYYY-MM-DD hh:mm:ss') : null}
          // transform datas in an object
          const data = TransformDataCelligen(files);
          let newManip = new celligenModel({ finish: finish, name: name, data: data, dateStart: dateStart });
          newManip.save(function (err, manip) {
            if (err) return console.error(err);
          });
        } else {
          res.sendStatus(400);
        }
      });
    }
  });
});

app.get('/manipinprogress', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      celligenModel.find({ finish: false }, function (err, manip) {
        if (err) {
          console.log(err);
        } else {
          res.json(manip);
        }
      });
    }
  });
});

app.put('/upload/:id', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      if (req.params.id) {
        const manipName = req.params.id;
        const files = req.body[2];
        const finished = req.body[0];
        const external = req.body[3];
        if (external) {
          celligenModel.findOne({ name: manipName }, (err, manip) => {
            if (err) {
              console.log(err);
            } else {
              console.log("external")
              const oldData = manip.data;
              const newData = TransformDataExternal(files, oldData);
              celligenModel.updateOne({ name: manipName }, { $set: { finish: finished, data: newData } }, { upsert: true }, (err, item) => {
                if (err) return console.error(err);
                return res.send("succesfully saved");
              })
            }
          });
        } else {
          const newData = TransformDataCelligen(files);
          celligenModel.findOne({ name: manipName }, (err, manip) => {
            if (err) {
              console.log(err);
            } else {
              const oldData = manip.data;
              let joinData = [];
              for (let j = 0; j < newData.length; j++) {
                joinData = [...joinData, newData[j]];
              }
              for (let i = 0; i < oldData.length; i++) {
                joinData = [...joinData, oldData[i]];
              }  
              const filteredData = _.uniq(joinData, 'Time');
              let sortByDate = filteredData.sort((a, b) => (moment(a.Time).format('X') > moment(b.Time).format('X')) ? 1 : ((moment(b.Time).format('X') > moment(a.Time).format('X')) ? -1 : 0));
              for (let i = 0; i < sortByDate.length; i++) {
                sortByDate[i].hour = (moment(sortByDate[i].Time).format('X') - moment(sortByDate[0].Time).format('X')) / 3600
              }
              celligenModel.updateOne({ name: manipName }, { $set: { finish: finished, data: sortByDate } }, { upsert: true }, (err, item) => {
                if (err) return console.error(err);
                return res.send("succesfully saved");
              })
            }
          });
        }
      } else {
        res.send('Failed to save');
      }
    }
  });
});

app.delete('/manip/:id',verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      if (req.params.id){
        const manipName = req.params.id;
        celligenModel.deleteOne({ name: manipName }, (err, manip) => {
          if (err) {
            console.log(err);
          } else {
            res.send("succesfully deleted");
          }
        });
      }
    }
  });
});

app.post('/login/SignUp/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      const values = req.body;
      bcrypt.hash(values.passwordSignUp, 10, (err, hash) => {
        let newAuth = new authModel({ name: values.nameSignUp, password: hash, email: values.emailSignUp });
        newAuth.save((err, auth) => {
          if (err) {
            console.log(err)
            res.status(500).send("Erreur lors de l'enregistrement d'un nouvel admin.");
          } else {
            console.log('signUp OK')
            res.sendStatus(200);
          }
        });
      });
    }
  });
});

app.post('/login/', (req, res) => {
  const values = req.body;
  console.log('login')
  authModel.findOne({ email: values.emailSignIn }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur dans l'email.");
    } else {
      if (result) {
        bcrypt.compare(values.passwordSignIn, result.password, (err, result) => {
          if (result === true) {
            console.log('signIn OK')
            const payload = { email: values.emailSignIn };
            const token = jwt.sign(payload, privateKEY, signOptions);
            res.send(token);
          } else {
            console.log('mauvais mot de passe')
            res.status(500).send("Erreur dans le mot de passe.");
          }
        });
      }
    }
  })
});

app.post('/auth/', verifyToken, (req, res) => {
  jwt.verify(req.token, publicKEY, verifyOptions, (err, authData) => {
    if (err) {
      console.log(err)
      res.sendStatus(403);
    } else {
      res.sendStatus(200)
    }
  });
});

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    console.log("ERROR VERIFY TOKEN")
    res.sendStatus(403);
  }
};