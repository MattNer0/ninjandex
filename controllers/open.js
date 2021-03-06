var keystone = require('keystone');
var fileManager = require('../helpers/fileManager');
var path = require('path');

module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var user = req.user;

	locals.section = 'open';

	if(!req.query.path || !req.params.folder_id) return res.redirect('back');

	var pathFolder = decodeURIComponent(req.query.path);
	if( pathFolder.indexOf('/../') >= 0 || pathFolder.indexOf('../') == 0 ) return res.redirect('back');
	if( !fileManager.exists(pathFolder) ) return res.redirect('back');

	if( user.folderGroup || user.isAdmin ) {

		var Folder = keystone.list('Folder');
		Folder.model.findById(req.params.folder_id).exec(function(err, folder){

			if( !user.isAdmin && user.folderGroup != folder.folderGroup ) return res.redirect('back');
			if( pathFolder == folder.path || pathFolder+'/' == folder.path ) return res.redirect('/');
			if( pathFolder.indexOf(folder.path) < 0 ) return res.redirect('back');

			locals.folders = [{
				id: folder.id,
				path: folder.path,
				path_back: encodeURIComponent( path.join(pathFolder, '..') ),
				folderName: path.basename( pathFolder ),
				files: fileManager.readFilesInsideFolder( pathFolder ),
				permissions: fileManager.read_write_permissions( pathFolder )
			}];
			view.render('index');
		});
	} else {
		return res.redirect('back');
	}
};
