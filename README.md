# MarketGeek Server
This repository contains all project files to run the backend server for the web version.

## Configure the API Server
You find most settings for the API server in the environment file located in the root directory of the project. You will need to set up a MongoDB instance on your local machine (default port) or host an instance in the cloud and point the application to the URI of that server.

## Try the API Test Program
You can use the included test program as a playground to use all the functionality of this API without having to call the endpoints directly.

Open the URL **/api/v1/test** in your browser and you will see a webpage that allows you to use every feature. You can also use this tool for development purposes but it won't be available on any release server for security purposes.

## Use the API
You don't need an API key as of right now. This feature will be implemented in the next update, and you will receive the details for a development test server that can be accessed from anywhere shortly after. 

You can send GET requests to the following endpoints:

- #### /api/v1/users
  This endpoint returns a JSON object of the users that are currently in the database. It doesn't require any arguments.

- #### /api/v1/user/create
  Use this endpoint to create a new user in the database. It requires three GET- parameters. Provide a String for email, password (will be hashed), and name (full name). 

- #### /api/v1/user/delete
  In order to delete an account from the database, use this endpoint with the email address (email) as its only argument. Please be cautious when using this API.

- #### /api/v1/user/get
  This API will return a user object. It requires an email address (email).

- #### /api/v1/user/auth
  Use this endpoint to authenticate a user. It requires two parameters: an email address (email) and a password (password), both strings. The password will be hashed on the server using Bcrypt and doesn't need to be encrypted when using this API.

