var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Folder Model
 * ==========
 */
var Folder = new keystone.List('Folder');

Folder.add({
	path: { type: String, required: true, label: "Absolute Path", index: true, initial: true },
}, 'Permissions', {
	folderGroup: { type: Number, label: "Folder Group Access", index: true },
});

/**
 * Registration
 */
Folder.defaultColumns = 'path, folderGroup';
Folder.register();
