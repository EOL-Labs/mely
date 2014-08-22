module.exports = {
	up: function(migration, DataTypes, done) {
		migration.addColumn(
			"Post",
			"comments_allowed",
			{
				type: DataTypes.BOOLEAN,
				allowNull: false
			}
		);
		done();
	}
}
