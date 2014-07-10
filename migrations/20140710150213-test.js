module.exports = {
  up: function(migration, DataTypes, done) {
    migration.removeColumn('ThemeSetting', 'header_logo');
  	migration.addColumn('ThemeSetting', 'headerfilename',{
  		type: DataTypes.STRING(50)
  	});
    done();
  }
}
