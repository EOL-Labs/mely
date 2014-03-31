module.exports = function(sequelize, DataTypes) {
    var Theme = sequelize.define("Theme", {
		name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		active: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Theme;
};
