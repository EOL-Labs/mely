module.exports = function(sequelize, DataTypes) {
    var Page = sequelize.define("Page", {
		title: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		content: {
			type: DataTypes.STRING(4000),
			allowNull: false
		},
		ordernum: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		onmenu:{
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
    }, {
        freezeTableName: true
    });
    return Page;
};
