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
        break;
}
var databaseConfiguration = require(db_config_to_use);
exports.database = databaseConfiguration;