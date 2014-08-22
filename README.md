## Mely ##
<b>M</b>ake <b>E</b>verything <b>L</b>ook <b>Y</b>ours

[![Build Status](https://travis-ci.org/EOL-Labs/mely.svg?branch=master)](https://travis-ci.org/EOL-Labs/mely)
[![Dependency Status](https://david-dm.org/eol-labs/mely.png?theme=shields.io)](https://david-dm.org/eol-labs/mely)
[![Code Climate](https://codeclimate.com/github/EOL-Labs/mely.png)](https://codeclimate.com/github/EOL-Labs/mely)
[![Coverage Status](https://coveralls.io/repos/EOL-Labs/mely/badge.png)](https://coveralls.io/r/EOL-Labs/mely)

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

```javascript
exports.mailconfig = {
  // list of method types below
  method: "sendmail",
  // custom transport methods
  // https://github.com/andris9/Nodemailer#custom-transport-methods
  sendmail:{
    bin: '/usr/sbin/sendmail',
    from: '"Server Name" <no-reply@yourdomain.com>'
  }
};

// - SMTP
// - SES = Amazon SES
// - Sendmail
// - Pickup = Email Storage in a directory on your machine
// - Direct = Sending Emails directly to recipients MTA servers
```

Start by:
```bash
node .
```

Go to http://yourhost:yourport/welcome

**v.0.1.0**

MIT

&copy; EOL Labs
