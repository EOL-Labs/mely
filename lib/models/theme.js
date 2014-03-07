module.exports = function(sequelize, DataTypes) {
    var Theme = sequelize.define("Theme", {
		theme_name: {
			type: DataTypes.STRING(100)
		},
		theme_description: {
			type: DataTypes.STRING(255)
		},
		theme_status: {
			type: DataTypes.BOOLEAN
		}
    }, {
        freezeTableName: true
    });
    return Theme;
};
