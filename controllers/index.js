var keystone = require('keystone');
var fileManager = require('../helpers/fileManager');

module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var user = req.user;

	locals.section = 'home';

	if( user && (user.folderGroup || user.isAdmin ) ) {

		function handleFolders(err, folders){
			if(err){
				console.log(err);
			} else {
				fileManager.readFolders( folders, function( foldersData ){
					locals.folders = foldersData;
					view.render('index');
				});
			}
		}

		var Folder = keystone.list('Folder');
		if( user.isAdmin ){
			Folder.model.find().exec(handleFolders);
		} else {
			Folder.model.find().where('folderGroup', user.folderGroup).exec(handleFolders);
		}
	} else {
		view.render('index');
	}
};
