# Mely #
<b>M</b>ake <b>E</b>verything <b>L</b>ook <b>Y</b>ours

[![Build Status](https://travis-ci.org/EOL-Labs/mely.svg?branch=master)](https://travis-ci.org/EOL-Labs/mely)
[![Dependency Status](https://david-dm.org/eol-labs/mely.png?theme=shields.io)](https://david-dm.org/eol-labs/mely)
[![Code Climate](https://codeclimate.com/github/EOL-Labs/mely.png)](https://codeclimate.com/github/EOL-Labs/mely)

Mely is a blog platform built on hapi.js/node.js

### Install Instructions ###

Create MYSQL db for Blog

Clone Mely > Go To Mely Folder > Copy/Edit Config Files > NPM Install
```bash
git clone git@github.com:EOL-Labs/Mely.git
cd Mely
cp config/database.example.js config/database.js
cp config/server.example.js config/server.js
cp config/mail.example.js config/mail.js
```

Edit config files
```javascript
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
exports.config = {
  hostname: "localhost",
  port: 8080,
};
```

```javascript
exports.mailconfig = {
    host: "mailserver_host",
    port: 25,
    from: "Server Name <no-reply@address.com>"
};
```

NPM Install
```bash
npm install .
```

Start Mely
```bash
node .
```

**Admin Interface**

http://localhost:8080/admin

**Blog Interface**

http://localhost:8080

&copy; EOL Labs