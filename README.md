## Mely ##
<b>M</b>ake <b>E</b>verything <b>L</b>ook <b>Y</b>ours

[![Build Status](https://travis-ci.org/EOL-Labs/mely.svg?branch=master)](https://travis-ci.org/EOL-Labs/mely)
[![Dependency Status](https://david-dm.org/eol-labs/mely.png?theme=shields.io)](https://david-dm.org/eol-labs/mely)

Mely is a blogging platform for ***node.js***. It is currently WIP. In order to install and use Mely correctly you will need to follow a few steps.

Clone Mely
```bash
git clone git@github.com:EOL-Labs/Mely.git
```

Go to Mely Folder and Copy Example Config files (located in /config)
```bash
cd Mely
cp config/database.example.js config/database.js
cp config/server.example.js config/server.js
cp config/mail.example.js config/mail.js
```

Install NPM Dependencies
```bash
npm install .
```

Create Database in a MySQL Server for use in your config file.

Edit and Save config files using templates below
```javascript
//database config file
exports.config = {
  type: "mysql",
  hostname: "localhost",
  port: 3306,
  db: "yourDBName",
  username: "yourUsername",
  password: "yourPassword"
}
```

```javascript
//server config file
exports.config = {
  hostname: "localhost",
  port: 80,
  https: false,
  options: {
    cors: true //defauls to false,
    location: "http://www.example.com" //change this to current hosting address if not using localhost if not comment out line
  }
}
```

Start by:
```bash
node .
```

Go to http://localhost:80/welcome


**v.0.1.0**

MIT

&copy; EOL Labs
