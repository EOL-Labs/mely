module.exports = function(sequelize, DataTypes) {
    var Theme = sequelize.define("Theme", {
		theme_name: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		theme_description: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		theme_status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		theme_active: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Theme;
};
