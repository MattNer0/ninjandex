var fs = require('fs');
var path = require('path');

function readFilesInsideFolder( folder_path ){

	var files = fs.readdirSync( folder_path );
	var filesData = [];
	var foldersData = [];

	for(var j=0; j<files.length; j++){

		var pathFile = path.join( folder_path, files[j] );
		var fileStat = fs.statSync( pathFile );

		if( fileStat.isDirectory() ){
			foldersData.push({
				path: pathFile,
				encoded_path: encodeURIComponent( pathFile ),
				name: files[j],
				isFolder: true,
				size: fileStat.size
			});
		} else {
			filesData.push({
				path: pathFile,
				encoded_path: encodeURIComponent( pathFile ),
				name: files[j],
				isFolder: false,
				size: fileStat.size
			});
		}
	}

	return foldersData.concat(filesData);
}

function readFolders(folders, callback){

	var foldersData = [];

	for(var i=0; i<folders.length; i++){
		var stat = fs.statSync( folders[i].path );
		if( stat.isDirectory() ){
			foldersData.push({
				id: folders[i].id,
				path: folders[i].path,
				folderName: path.basename( folders[i].path ),
				files: readFilesInsideFolder(folders[i].path),
			});
		}
	}

	callback(foldersData);
}

module.exports = {
	readFolders: 			readFolders,
	readFilesInsideFolder: 	readFilesInsideFolder,
}