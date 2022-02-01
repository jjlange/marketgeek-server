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
 const express = require('express')
 const app = express()
 const server = require('http').createServer(app)

 console.clear()
 console.log('MarketGeek Server - API v1.0\nCopyright (C) 2022, MarketGeek.\n\nStarting server...\n')

 // Database driver
 const db = require('./db/con');
 db.connectDB()

 // Routes
 app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
 })

 app.get('/api/v1/test', (req, res) => {
    res.sendFile(__dirname + '/public/test.html');
 })

 app.get('/api/v1/users', (req, res) => {
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
 })

 app.get('/api/v1/user/create', (req, res) => {
    let user = {
        name: req.query.name,
        email: req.query.email,
        password: req.query.password
    }

    // Check if email is already in use
    db.checkUserExists(user.email, function(err, result) {
        if (err) {
            response = {
                message: "creation failed. error: " + err,
                error: true
            }

            res.status(500).send(response)
        } else if (result) {
            response = {
                message: 'creation failed. email already in use',
                error: true
            }

            res.status(500).send(response)
        } else {
            db.createUser(user, function(err) {
                if (err) {
                    console.log('SERVER: Error creating user');

                    response = {
                        message: 'creation failed. error: ' + err,
                        error: true
                    }
                } else {
                    response = {
                        message: 'creation successful',
                        error: false
                    }
                }

                res.status(200).send(response);
            })
        }
    })
})

app.get('/api/v1/user/auth', (req, res) => {
    let user = {
        email: req.query.email,
        password: req.query.password
    }

    db.authUser(user, function(response) {
        res.send(response)
    })
})

app.get('/api/v1/user/get', (req, res) => {
    let user = {
        email: req.query.email
    }

    db.getUser(user, function(err, result) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(result)
        }
    })
})

app.get('/api/v1/user/delete', (req, res) => {
    let user = {
        email: req.query.email
    }

    
    db.deleteUser(user, function(response) {
        res.send(response)
    })
 
})

 // Run server
server.listen(3000, function() {
    console.log("SERVER: Started on port 3000");
})