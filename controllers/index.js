var keystone = require('keystone');
var fs = require('fs');
var path = require('path');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var user = req.user;

	locals.section = 'home';

	if( user && (user.folderGroup || user.isAdmin ) ) {

		function readFolders( err, folders){
			if(err) console.log(err);

			var folderData = [];

			for(var i=0; i<folders.length; i++){
				var stat = fs.statSync( folders[i].path );

				if( stat.isDirectory() ){

					var files = fs.readdirSync( folders[i].path );
					var filesData = [];

					for(var j=0; j<files.length; j++){

						var pathFile = path.join( folders[i].path, files[j] );
						var fileStat = fs.statSync( pathFile );

						filesData.push({
							path: pathFile,
							encoded_path: encodeURIComponent( pathFile ),
							name: files[j],
							isFolder: fileStat.isDirectory(),
							size: fileStat.size
						});
					}

					folderData.push({
						id: folders[i].id,
						path: folders[i].path,
						folderName: path.basename( folders[i].path ),
						files: filesData,
					});
				}
			}

			locals.folders = folderData;

			view.render('index');
		}

		var Folder = keystone.list('Folder');
		if( user.isAdmin ){
			Folder.model.find().exec( readFolders );
		} else {
			Folder.model.find().where('folderGroup', user.folderGroup).exec( readFolders );
		}
	} else {
		view.render('index');
	}
};
