switch (process.env.NODE_ENV) {
	case "test_travis":
        exports.database = require("./database.test_travis");
		break;
	case "test":
        exports.database = require("./database.test");
        break;
    case undefined:
    case "production":
    case "development":
        exports.database = require("./database");
        break;
}