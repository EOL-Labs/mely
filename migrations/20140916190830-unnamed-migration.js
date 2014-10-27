module.exports = {
	up: function(migration, DataTypes, done) {
		migration.changeColumn(
			"System",
			"description",
			{
			type: DataTypes.STRING(4000),	
			allowNull: true
			}
		)
	done();
	}
}