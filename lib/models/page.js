module.exports = function(sequelize, DataTypes) {
    var Page = sequelize.define("Page", {
		page_title: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		page_content: {
			type: DataTypes.STRING(4000),
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Page;
};
