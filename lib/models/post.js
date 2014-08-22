module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
		title: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		content: {
			type: DataTypes.STRING(4000),
			allowNull: false
		},
		comments_allowed: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Post;
};
