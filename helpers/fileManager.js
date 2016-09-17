var fs = require('fs');
var path = require('path');

function readFilesInsideFolder( folder_path ){

	var files = fs.readdirSync( folder_path );
	var filesData = [];
	var foldersData = [];

	for(var j=0; j<files.length; j++){

		if( files[j][0] == '.' ) continue;

		var pathFile = path.join( folder_path, files[j] );
		
		if( fs.existsSync(pathFile) ){
			try {
				var fileStat = fs.statSync( pathFile );

				if( fileStat.isDirectory() ){

					foldersData.push({
						path: pathFile,
						encoded_path: encodeURIComponent( pathFile ),
						name: files[j],
						isFolder: true,
						size: fileStat.size,
						permissions: read_write_permissions( pathFile )
					});

				} else {
					filesData.push({
						path: pathFile,
						extension: path.extname( pathFile ).toLowerCase(),
						encoded_path: encodeURIComponent( pathFile ),
						name: files[j],
						isFolder: false,
						size: fileStat.size
					});
				}
			} catch(err) {
				console.log(err);
			}
		}
	}

	return foldersData.concat(filesData);
}

function read_write_permissions( path ){
	try {
		fs.accessSync(path, fs.R_OK | fs.W_OK );
		return 'read/write';
	} catch(err) {
		//console.log('read/write permissions error', err);
		return 'read';
	}
}

function readFolders(folders, callback){

	var foldersData = [];

	for(var i=0; i<folders.length; i++){
		try {
			if( fs.existsSync(folders[i].path) ){
				var stat = fs.statSync( folders[i].path );
				if( stat.isDirectory() ){					

					foldersData.push({
						id: folders[i].id,
						path: folders[i].path,
						folderName: path.basename( folders[i].path ),
						files: readFilesInsideFolder(folders[i].path),
						permissions: read_write_permissions( folders[i].path )
					});
				}
			}
		} catch(err) {
			console.log(err);
		}
	}

	callback(foldersData);
}

function checkFileExists( folder_path, filename, timestamp ){
	var pathFile = path.join( folder_path, filename );
	
	if( !fs.existsSync(pathFile) ){
		return pathFile;
	} else {
		pathFile = path.join( folder_path, timestamp+"_"+filename );
		if( !fs.existsSync(pathFile) ){
			return pathFile;
		} else {
			return false;
		}
	}
}

function exists(folder_path){
	return fs.existsSync(folder_path);
}

function moveFile(fromPath, toPath){
	fs.renameSync( fromPath, toPath);
}

module.exports = {
	readFolders: 			readFolders,
	readFilesInsideFolder: 	readFilesInsideFolder,
	read_write_permissions: read_write_permissions,
	checkFileExists: checkFileExists,
	exists: exists,
	moveFile: moveFile
}