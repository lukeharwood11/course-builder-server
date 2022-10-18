# Course Builder

### Setting up the project for development
1. Set up a database locally using the provided script
2. Create a .env file to set the following variables
```
DB_PASSWORD=?
ACCESS_TOKEN_SECRET=?
REFRESH_TOKEN_SECRET=?
DEBUG=*
```
To generate the token secrets execute the following command (twice, once for each token secret):

```
>>> node

Welcome to Node.js v16.17.0.
Type ".help" for more information.

> require('crypto').randomBytes(64).toString('hex')
```

Copy and paste each output into the corresponding secret env variable

### Debug
Set DEBUG to any value found within the application for the debug module, setting it to * activates all debug logging.


