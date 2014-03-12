module.exports = function(sequelize, DataTypes) {
    var ThemeSetting = sequelize.define("ThemeSetting", {
		header_logo: {
			type: DataTypes.STRING(500)
		},
		header_backgroundcolor: {
			type: DataTypes.STRING(6)
		},
		header_fontcolor: {
			type: DataTypes.STRING(6)
		},
		header_fontsize: {
			type: DataTypes.INTEGER
		},
		menu_backgroundcolor: {
			type: DataTypes.STRING(6)
		},
		menu_fontcolor: {
			type: DataTypes.STRING(6)
		},
		menu_fontsize: {
			type: DataTypes.INTEGER
		},
		post_titlefontcolor: {
			type: DataTypes.STRING(6)
		},
		post_titlefontsize: {
			type: DataTypes.INTEGER
		},
		post_contentfontcolor: {
			type: DataTypes.STRING(6)
		},
		post_contentfontsize: {
			type: DataTypes.INTEGER
		},
		page_titlefontcolor: {
			type: DataTypes.STRING(6)
		},
		page_titlefontsize: {
			type: DataTypes.INTEGER
		},
		page_contentfontcolor: {
			type: DataTypes.STRING(6)
		},
		page_contentfontsize: {
			type: DataTypes.INTEGER
		}
    }, {
        freezeTableName: true
    });
    return ThemeSetting;
};
