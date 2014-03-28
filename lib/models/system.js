module.exports = function(sequelize, DataTypes) {
    var System = sequelize.define("System", {
		system_name: {
			type: DataTypes.STRING(55),
			allowNull: false
		},
		system_description: {
			type: DataTypes.STRING(4000),
			allowNull: false
		},
		system_status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return System;
};
