module.exports = function(sequelize, DataTypes) {
    var System = sequelize.define("System", {
		system_name: {
			type: DataTypes.STRING(55)
		},
		system_description: {
			type: DataTypes.STRING(4000)
		},
		system_status: {
			type: DataTypes.BOOLEAN
		}
    }, {
        freezeTableName: true
    });
    return System;
};
