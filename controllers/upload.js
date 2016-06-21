var keystone = require('keystone');
var fileManager = require('../helpers/fileManager');

module.exports = function(req, res) {

	var user = req.user;

	var pathFolder = req.body.path;
	if( !req.files.upload ) res.redirect('back');
	if( pathFolder.indexOf('/../') >= 0 || pathFolder.indexOf('../') == 0 ) res.redirect('back');

	console.log( req.files.upload );

	if( user.folderGroup || user.isAdmin ) {

		var Folder = keystone.list('Folder');
		Folder.model.findById(req.body.folder_id).exec(function(err, folder){

			if(!user.isAdmin && user.folderGroup != folder.folderGroup) return res.redirect('back');
			if( pathFolder.indexOf(folder.path) < 0 ) return res.redirect('back');

			filePathMove = fileManager.checkFileExists( pathFolder, req.files.upload.originalname, req.files.upload.name.split('.')[0] );
			if(!filePathMove) res.redirect('back');

			fileManager.moveFile( req.files.upload.path, filePathMove );

			res.redirect('back');

		});
	} else {
		res.redirect('back');
	}
};
