
var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

/*
	ESTABLISH DATABASE CONNECTION
*/

var dbName = process.env.DB_NAME || 'events';
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

var news = db.collection('news');

/* record insertion, update & deletion methods */

exports.addNews = function(newData, callback)
{
	// append date stamp when record was created //
	newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
	news.insert(newData, {safe: true}, callback);
}

exports.updateNews = function(newData, callback)
{
	news.findOne({_id:getObjectId(newData.id)}, function(e, o){
		//console.log(newData);
		//console.log("ERR");
		o.event_name 		= newData.event_name;
		o.event_type 	    = newData.event_type;
		o.event_date 	    = newData.event_date;
		news.save(o, {safe: true}, function(e) {
		if (e) callback(e);
			else callback(null, o);
		});
	});
}


/* account lookup methods */

exports.deleteNews = function(id, callback)
{
	news.remove({_id: getObjectId(id)}, callback);
}


exports.getAllRecords = function(callback)
{
	news.find().toArray(
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

exports.delAllRecords = function(callback)
{
	news.remove({}, callback); // reset news collection for testing //
}

/* private encryption & validation methods */


var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
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