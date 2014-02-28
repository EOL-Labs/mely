module.exports = function(sequelize, DataTypes) {
    var Page = sequelize.define("Page", {
		title: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		content: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		status: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Page;
};
