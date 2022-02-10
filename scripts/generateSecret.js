/**
 * MarketGeek Server
 * Copyright (C) 2022, MarketGeek.
 * 
 * Script / Tool
 * 
 * @version 1.0
 * @description Script to generate an access secret key for the application
 */

// Import the required module
const crypto = require('crypto')

// Clear console
console.clear()

// Generate an access secret key
const accessSecret = crypto.randomBytes(64).toString('hex')

// Console outputs
console.log('This script will generate an access secret key for the application.\n')
console.log('Access Secret: ' + accessSecret)
console.log('\n\nCopy and paste the key in the .env file and start the server using node.')
console.log('\n')