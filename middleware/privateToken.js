/**
 * MarketGeek Server
 * Copyright (C) 2022, MarketGeek.
 *
 * This is the server for the MarketGeek application.
 * It is responsible for handling all incoming requests.
 * 
 * @version 1.0
 * @description Authentication middleware to protect the API
 */

function verifyToken(req, res, next) {
     // Check if API key is set

    if (req.body.api_key  != undefined) {   
         if(req.body.api_key != process.env.API_ACCESS_KEY) {
             console.log('SERVER: API key is invalid!')
             return false
         } else {
            console.log('SERVER: API key is valid!')
            return true
         }
     } else { 
        console.log('SERVER: API key is invalid!')
        return false
    }
    return true;
}

module.exports = verifyToken