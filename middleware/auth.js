/**
 * MarketGeek Server
 * Copyright (C) 2022, MarketGeek.
 *
 * This is the server for the MarketGeek application.
 * It is responsible for handling all incoming requests.
 * 
 * @version 1.0
 * @description Middleware to authenticate someone using their JWT token
 */

// Import modules
const jwt = require('jsonwebtoken')

// Export required methods for JWT authentication 
module.exports = {
    /**
     * Method to verify an existing JWT token
     * @returns HTTP Status
     */
    authToken: function(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.sendStatus(401)
    
        // Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403)
            req.user = decoded
            next()
        })
    },

    // Method to return the user id of an existing token
    returnUserId: function(req) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        return decoded.id
    }
}