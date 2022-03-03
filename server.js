/**
 * MarketGeek Server
 * Copyright (C) 2022, MarketGeek.
 * 
 * This is the server for the MarketGeek application.
 * It is responsible for handling all incoming requests.
 * 
 * @version 1.0
 * @description Main application entry point
 */

 // Require modules
 const { debug } = require('console')
 const express = require('express')
 const app = express()
 const server = require('http').createServer(app)
 const bodyParser = require('body-parser')
 const cors = require('cors')
 const jwt = require('jsonwebtoken')
 const mongo = require('mongodb')

 // Environment file
 const dotenv = require('dotenv').config()

 // Middleware 
 const auth = require('./middleware/privateToken')
 const authToken = require('./middleware/auth').authToken
 const returnUserId = require('./middleware/auth').returnUserId

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
 
 // Get debug mode from environment
 const debug_mode = process.env.APP_DEBUG || false

 console.clear()
 console.log('MarketGeek Server - API v1.0\nCopyright (C) 2022, MarketGeek.\n\nStarting server...\n')

 // Database driver
 const db = require('./db/dbCon');
 db.connectDB()

 // Express configuration
 app.use(bodyParser.json());
 app.use(cors());

 app.get('/', async (req, res) => {
    if(!auth(req, res)) { res.send("Unauthorized") } else {
        res.sendFile(__dirname + '/public/index.html');
    }
 })

 app.get('/api/v1/test', (req, res) => {
    if(!auth(req, res)) { res.send("Unauthorized") } else {
        res.sendFile(__dirname + '/public/test.html');
    }
 })

 app.get('/api/v1/users', (req, res) => {
    if(!auth(req, res)) { return res.send("Unauthorized") } else {
        db.listUser(function(err, result) {
            if (err) {
                res.status(500).send(err)
            } else {
                // Check if result is empty
                if (result.length == 0) {
                    res.send('no users found')
                } else {
                    res.status(200).send(result)
                }
            }
        })
    }
 })

 app.post('/api/v1/user/create', (req, res) => {
    if(!auth(req, res)) { res.send("Unauthorized") } else {
        let user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }

        // Check if email is already in use
        db.checkUserExists(user.email, function(err, result) {
            if (err) {
                response = {
                    message: "ERROR",
                    error: true
                }

                res.status(500).send(response)
            } else if (result) {
                response = {
                    message: 'EMAIL_IN_USE',
                    error: true
                }

                res.status(500).send(response)
            } else {
                db.createUser(user, function(err) {
                    if (err) {
                        debug ? console.log('SERVER: Error creating user') : null

                        response = {
                            message: 'creation failed. error: ' + err,
                            error: true
                        }
                    } else {
                        response = {
                            message: "SUCCESS",
                            error: false
                        }
                    }

                    res.status(200).send(response);
                })
            }
        })
    }
})

app.post('/api/v1/user/auth', (req, res) => {
    if(!auth(req, res)) { res.send("Unauthorized") } else {
        let user = {
            email: req.body.email,
            password: req.body.password
        }

        db.authUser(user, response => {
            if(response.error) {
                res.send(response)
            } else {
                db.getUser({email: user.email}, result => {
                    if (result.length < 1) {
                        console.log("SERVER: Error getting user")
                        res.status(500).send(result)
                    } else {
                        dbUser = {
                            id: result._id,
                            name: result.name,
                            email: result.email,
                        }

                        jwt.sign(dbUser, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }, (err, token) => {
                            if (err) {
                                console.log("SERVER: Error creating token")
                                res.status(500).send(err)
                            } else {
                                res.status(200).send({
                                    accessToken: token,
                                    user: result,
                                    error: response.error
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})




// Route to check if the user is authenticated
app.get('/api/v1/user/checkToken', authToken, (req, res) => {
    // Return the user id from the token
    let user = {
        _id: returnUserId(req),
    }

    // Return user object 
    db.getDB().collection('users').findOne({"_id": new mongo.ObjectId(user._id)}, function(err, result) {
        if (err) {
            console.log('SERVER: Error getting user')
            console.log(err)
        }

        if(result) {
            let response = {
                user: result,
                message: "token_valid"
            }
            res.status(200).send(response)
        } else {
            console.log("SERVER: Error getting user")
            console.log(err)
            res.status(500).send(err)
        }
    })
})

app.get('/api/v1/user/get', (req, res) => {
    if(!auth(req, res)) { res.send("Unauthorized") } else {
        let user = {
            email: req.query.email
        }

        db.getUser(user, function(err, result) {
            if (err) {
                res.send(err)
            } else {
                res.send(result)
            }
        })
    }
})

app.get('/api/v1/user/delete', (req, res) => {
    if(!auth(req, res)) { res.send("Unauthorized") } else {
        let user = {
            email: req.query.email
        }
        
        db.deleteUser(user, function(response) {
            res.send(response)
        })
    }
})

 // Run server
server.listen(process.env.APP_PORT , function() {
    console.log("SERVER: Started on port " + process.env.APP_PORT);
    if(debug_mode) {console.log('SERVER: Error messages are enabled')}
})