module.exports = function(sequelize, DataTypes) {
    var ThemeSetting = sequelize.define("ThemeSetting", {
		header_logo: {
			type: DataTypes.STRING(500),
			allowNull: false
		},
		header_backgroundcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		header_fontcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		header_fontsize: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		menu_backgroundcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		menu_fontcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		menu_fontsize: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		post_titlefontcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		post_titlefontsize: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		post_contentfontcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		post_contentfontsize: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		page_titlefontcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		page_titlefontsize: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		page_contentfontcolor: {
			type: DataTypes.STRING(6),
			allowNull: false
		},
		page_contentfontsize: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return ThemeSetting;
};
