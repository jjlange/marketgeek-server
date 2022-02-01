/**
 * MarketGeek Server
 * Copyright (C) 2022, MarketGeek.
 *
 * This is the server for the MarketGeek application.
 * It is responsible for handling all incoming requests.
 * 
 * @version 1.0
 * @description Database driver for MongoDB
 */

// Import the required modules
const MongoClient = require('mongodb').MongoClient

// Configure the server
const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marketgeek'
const client = new MongoClient(connectionString, { useNewUrlParser: true })
const bcrypt = require('bcrypt-nodejs')
const salt = bcrypt.genSaltSync(10);

// Initialise database variable
let db

module.exports = {
    
     /**
      * Method to connect to the database and set the database variable
      **/
    connectDB: function() {
        client.connect(function(err) {
            if (err) {
                console.log('SERVER: Error connecting to database')
                return callback(err)
            }

            db = client.db('marketgeek')
            console.log('SERVER: Database connected')
        })
    },

    /**
     * Method to create a new user in the database
     * @argument {Object} user - The user object to create
     * @argument {Function} callback - The callback function
     * 
     * @returns {Object} The user object created
     **/
    createUser: function(user, callback) {
        // Hash the password in bcrypted format
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                console.log('SERVER: Error hashing password')
                return callback(err)
            }

            // Create the user object
            let newUser = {
                name: user.name,
                email: user.email,
                password: hash
            }

            db.collection('users').insertOne(newUser, function(err) {
                if (err) {
                    console.log('SERVER: Error creating user')
                    return callback(err)
                }
                    
                console.log('SERVER: User created')
                return callback(null)
            })
        })
    },

    /**
     * Method to remove a user from the database
     * @argument {Object} user - The user (email) object to remove
     * 
     * @returns {Boolean} True if the user was removed, err otherwise
     */
    deleteUser: function(user, callback) {
        db.collection('users').findOne({email: user.email}, function(err, result) {
            if (err) {
                console.log('SERVER: Error checking user exists')
                return callback(err)
            }

            var response;

            if (result) {
                db.collection('users').deleteOne({email: user.email}, function(err) {
                    if (err) {
                        console.log('SERVER: Error deleting user')
                        return callback(err)
                    }

                    console.log('SERVER: User deleted')

                    response = {
                        message: 'user deleted',
                        error: false
                    }

                    return callback(response)
                })
            } else {
                console.log('SERVER: User does not exist')
                response = {
                    message: 'user does not exist',
                    error: true
                }

                return callback(response)
            }
        })
    },

    /**
     * Method to authenticate a user against the database
     * @argument {Object} user - The user object to authenticate
     * @returns {Object} The user object authenticated
     **/
    authUser: function(user, callback) {
        // Query the database for the user
        var query = {
            email: user.email,
            password: user.password
        }

        // Hash the password in bcrypted format
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) {
                console.log('SERVER: Error hashing password!')
                return callback("Error hashing password! " + err)
            }

            query = {
                email: user.email,
                password: hash
            }

            // Find the user in the database
            db.collection('users').findOne(query, function(err, user) {
                if (err) {
                    console.log('SERVER: Error finding user');
                    return;
                }

                if (!user || user.length === 0 || user === null) {
                    response = {
                        message: "password incorrect",
                        error: true
                    }
                } else {
                    response = {
                        message: "authenticated",
                        error: false,
                        user: user
                    }
                }

                callback(response)
            })
        })
    },

    /**
     * Method to list all users in the database
     * @returns {Object} The users object
     **/
    listUser: function(callback) {
        db.collection('users').find({}).toArray(function(err, result) {
            if (err) {
                console.log('SERVER: Error getting users')
                return
            }

            console.log('SERVER: Users retrieved')
            return callback(result)
        })
    },

    /**
     * Method to check if a user exists in the database
     * @argument {String} email - The email to check
     * @returns {Boolean} Whether the user exists or not
     **/
    checkUserExists: function(email, callback) {
        db.collection('users').findOne({email: email}, function(err, result) {
            if (err) {
                console.log('SERVER: Error checking user exists')
                return callback(err)
            }

            console.log('SERVER: User exists')
            return callback(result)
        })
    },

    /**
     * @argument {Object} user (email) - The email to check
     * @returns {Object} The users object
     */
    getUser: function(user, callback) {

        db.collection('users').findOne({email: user.email}, function(err, result) {
            if (err) {
                console.log('SERVER: Error getting user')
                return callback(err)
            }

            console.log('SERVER: User retrieved')

            var response


            if(result) {
                response = {
                    message: "user found",
                    error: false,
                    user: result
                }

                return callback(response)
            } else {
                response = {
                    message: "user not found",
                    error: true
                }
                return callback(response)
            }
        })
    },

    /**
     * Method to retrieve the database
     * @returns {Object} The database object
     **/
    getDB: function() {
        return db
    }
}