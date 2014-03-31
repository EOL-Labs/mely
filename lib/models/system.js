module.exports = function(sequelize, DataTypes) {
    var System = sequelize.define("System", {
		name: {
			type: DataTypes.STRING(55),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(4000),
			allowNull: false
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return System;
};
