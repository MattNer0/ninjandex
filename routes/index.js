var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var controllers = importRoutes('../controllers');

module.exports = function (app) {
	app.get( '/', controllers.index );
	app.get( '/download/:folder_id', 	middleware.requireUser, 	controllers.download );
	app.get( '/open/:folder_id', 		middleware.requireUser, 	controllers.open );

	app.post('/upload', middleware.requireUser, 	controllers.upload );
};