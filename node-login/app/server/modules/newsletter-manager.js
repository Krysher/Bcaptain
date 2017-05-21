
var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

/*
	ESTABLISH DATABASE CONNECTION
*/

var dbName = process.env.DB_NAME || 'newsletter';
var dbHost = process.env.DB_HOST || 'localhost'
var dbPort = process.env.DB_PORT || 27017;

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
	if (e) {
		console.log(e);
	} else {
		if (process.env.NODE_ENV == 'live') {
			db.authenticate(process.env.DB_USER, process.env.DB_PASS, function(e, res) {
				if (e) {
					console.log('mongo :: error: not authenticated', e);
				}
				else {
					console.log('mongo :: authenticated and connected to database :: "'+dbName+'"');
				}
			});
		}	else{
			console.log('mongo :: connected to database :: "'+dbName+'"');
		}
	}
});

var news = db.collection('newsletter');

/* record insertion, update & deletion methods */

exports.addNewsletter = function(newData, callback)
{
	// append date stamp when record was created //
	newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
	news.insert(newData, {safe: true}, callback);
}


/* account lookup methods */

exports.deleteNewsletter = function(id, callback)
{
	news.remove({_id: getObjectId(id)}, callback);
}


exports.getAllRecords = function(callback, callerID)
{
	news.find({creatorID: callerID}).toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.getAllEvent = function(callback)
{
	news.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}


exports.printWithId = function(id, callback)
{
	news.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

/* private encryption & validation methods */


var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
	var id = id.substring(2);
	news.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	news.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}