module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define("Post", {
		post_title: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		post_content: {
			type: DataTypes.STRING(4000),
			allowNull: false
		}
    }, {
        freezeTableName: true
    });
    return Post;
};
