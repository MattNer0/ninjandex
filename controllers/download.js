var keystone = require('keystone');
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var slug = require('slug');

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;
	var user = req.user;

	locals.section = 'download';

	var pathFile = decodeURIComponent(req.query.path);
	var file_slug = slug( path.basename( pathFile ) );

	console.log(file_slug);

	if( user && (user.folderGroup || user.isAdmin ) ) {

		var Folder = keystone.list('Folder');
		Folder.model.findById(req.params.folder_id).exec(function(err, folder){
			if(!user.isAdmin && user.folderGroup != folder.folderGroup){
				res.redirect('/');
			}

			if( pathFile.indexOf(folder.path) < 0 ){
				res.redirect('/');
			}

			var archive = archiver('zip');

			archive.on('error', function(err) {
				res.status(500).send({error: err.message});
			});

			//on stream closed we can end the request
			archive.on('end', function() {
				console.log('Archive wrote %d bytes', archive.pointer());
			});

			//set the archive name
			res.attachment(file_slug+'.zip');

			//this is the streaming magic
			archive.pipe(res);

			var fileStat = fs.statSync( pathFile );
			if( fileStat.isDirectory() ){

				archive.directory(pathFile, path.basename(pathFile) );

			} else {

				archive.file(pathFile, { name: path.basename(pathFile) });

			}

			archive.finalize();
		});
	} else {
		res.redirect('/')
	}
};
