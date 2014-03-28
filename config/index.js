var db_config_to_use = '';
switch (process.env.NODE_ENV) {
	case 'test_travis':
		db_config_to_use = './database.test_travis';
		break;
	case 'test':
		db_config_to_use = './database.test';
        break;
    case undefined:
    case 'production':
    case 'development':
        db_config_to_use = './database';
        var mailConfiguration = require("./mail")
        var serverConfiguration = require("./server")
        exports.mail = mailConfiguration
        exports.server = serverConfiguration
        break;
}
console.log(db_config_to_use)
var databaseConfiguration = require(db_config_to_use)
exports.database = databaseConfiguration