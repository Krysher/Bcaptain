var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var RM = require('./modules/resident-manager');
var NM = require('./modules/news-manager');
var NL = require('./modules/newsletter-manager')
var reachmail = require('./modules/reachmailapi.js');



var sendOutEmail = function(newsletter) {
	/*
	var reachmailTemplate = "";
	//console.log(newsletter);
	for (i = 0; i < newsletter.newsletter_receipt.length; i++) {
		var temporary = newsletter.newsletter_receipt[i];
		reachmailTemplate += "{ Address: '" + temporary + "'}"
	}
*/
	var unescaped_body = unescape(encodeURIComponent(newsletter.newsletter_body));
	//var escapedBody = newsletter.newsletter_body.replace(/"/g, '\\"');


	var api = new reachmail({token: 'TIeQWYMm5aRz8JUZ_pFjUkgSh2cfst5uetYbagzc0XkUqNs7dUk2JBackABPcuw2'});

//The following builds the content of the message
	var body={
		FromAddress: 'admin@blockcapta.in',
		Recipients: [],
	  	Headers: { 
			Subject: 'BlockCaptain Network Newsletter' , 
			From: 'BlockCaptain Network <admin@blockcapta.in>', 
			'X-Company': 'BlockCaptain Network', 
			'X-Location': 'Philadelphia' 
		}, 
		BodyHtml: unescaped_body, 
		Tracking: true
	};
	//JSON encode the message body for transmission
	jsonBody = JSON.stringify(body);
	var data = JSON.parse(jsonBody);
	var newAddresses = newsletter.newsletter_receipt.map(function(r) { return {Address: r};});
	data.Recipients = data.Recipients.concat(newAddresses);
	var yourNewJson = JSON.stringify(data);
	console.log(yourNewJson);
	/* 
	The function below retreieves the account GUID. Only when succefful will the 
	function proceed to them schedule the message for delivery.
	Information is printed to screen through the use of console.log(...)
	*/
	api.administrationUsersCurrent(function (http_code, response) {
		if (http_code===200) {
			AccountId=response.AccountId; //extracts account GUID from response obj
			console.log("Success!  Account GUID: " + AccountId); //prints out the Account GUID
			//Next Function sends the message
			api.easySmtpDelivery(AccountId, yourNewJson, function (http_code, response) {
				if (http_code===200) {
					console.log("successful connection to EasySMTP API");
					console.log(response);
				}else { 
					console.log("Oops, looks like an error on send. Status Code: " + http_code);
					console.log("Details: " + response);
				}
			});
		} else {
			console.log("Oops, there was an error when trying to get the account GUID. Status Code: " + http_code);
			console.log("Details: " + response);
		}
	});
}





module.exports = function(app) {

// main login page //
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
			}	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'true'){
					res.cookie('user', o.user, { maxAge: 900000, httpOnly: true  });
					res.cookie('pass', o.pass, { maxAge: 900000, httpOnly: true });
				}
				res.status(200).send(o);
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/home', function(req, res) {
		if (req.session.user == null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}	else{
			res.render('home', {
				title  : 'Control Panel',
				udata  : req.session.user
			});
		}
	});
	
	app.post('/home', function(req, res){
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			AM.updateAccount({
				id			: req.session.user._id,
				firstname 	: req.body['firstname'],
				lastname 	: req.body['lastname'],
				email		: req.body['email'],
				pass		: req.body['pass'],
				address		: req.body['address']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user != undefined && req.cookies.pass != undefined){
						res.cookie('user', o.user, { maxAge: 900000, httpOnly: true });
						res.cookie('pass', o.pass, { maxAge: 900000, httpOnly: true });	
					}
					res.status(200).send('ok');
				}
			});
		}
	});

	app.post('/logout', function(req, res){
		res.clearCookie('user');
		res.clearCookie('pass');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup' });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			firstname 	: req.body['firstname'],
			lastname 	: req.body['lastname'],
			email 		: req.body['email'],
			user 		: req.body['user'],
			pass		: req.body['pass'],
			address 	: req.body['address']
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.body['email'], function(o){
			if (o){
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// TODO add an ajax loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
						res.status(400).send('unable to dispatch password reset');
					}
				});
			}	else{
				res.status(400).send('email-not-found');
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query["e"];
		var passH = req.query["p"];
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		})
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.body['pass'];
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('unable to update password');
			}
		})
	});
	
// view & delete accounts //
	
/*	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		})
	});
*/	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});

	app.post('/remove', function(req, res){
		AM.removeAccount(req.body.id, function(e, obj){
			if (!e){
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
	
	app.get('/about', function(req, res) {
		res.render('about', {  title: 'About the team'});
	});

	app.get('/manage', function(req, res) {
		if (req.session.user == null){
			// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}
			else {
			RM.getAllRecords( function(e, accounts){
				res.render('manage', {  title: 'Manage your block', accts: accounts, udata: req.session.user });
			}, req.session.user._id)
		}
	});
		app.get('/calendar', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}
		else {
			NM.getAllRecords( function(e, news){
				res.render('calendar', {  title: 'Manage your calendar', newsData: news, udata: req.session.user });
			}, req.session.user._id)
		}
	});
		app.get('/newsletters', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}
		else {
			NM.getAllRecords( function(e, news){
				RM.getAllRecords( function(e, accounts){
					NL.getAllRecords( function(e, newsletters){
						res.render('newsletter', {  title: 'Manage your newsletter', letterData: newsletters, newsData: news, acctData: accounts, udata: req.session.user });
					}, req.session.user._id);
				}, req.session.user._id);
			}, req.session.user._id);
		}
	});
		app.get('/news', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}
		else {
			NM.getAllRecords( function(e, news){
				res.render('news', {  title: 'Manage your News', accts: news, udata: req.session.user });
			}, req.session.user._id)
		}
	});


		app.get('/printnewsletters', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}
		else {
			//console.log(req.query.q);
			NL.printWithId( req.query.q, function(e, news){
				res.render('printnewsletters', {  title: 'Printing your news', newsletter: news });
			})
		}
	});



/*
		app.post('/printnewsletters', function(req, res){
		NL.findById(req.body.ni, function(e, obj){
			if (!e){
				console.log(res.body);
				res.status(200).send('ok');
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});


*/

	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });




//Resident update and add
	app.post('/addresident', function(req, res){
		RM.addNewAccount({
			firstname 	: req.body.fn,
			lastname 	: req.body.ln,
			email 		: req.body.email,
			address 	: req.body.address,
			creatorID   : req.body.creatorID
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

		app.post('/addNews', function(req, res){
		NM.addNews({
			event_name 	   : req.body.en,
			event_type 	   : req.body.et,
			event_duration : req.body.edur,
			event_date     : req.body.ed,
			event_dec	   : req.body.dec,
			creator        : req.body.creator,
			creatorID      : req.body.creatorID
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

	app.post('/addNewsletter', function(req, res){
		NL.addNewsletter({
			newsletter_name 	   : req.body.nn,
			newsletter_receipt 	   : req.body.nr,
			newletter_events_id	   : req.body.ei,
			newsletter_body		   : req.body.nb,
		}, function(e){
			if (e){
				res.status(400).send(e);
			}	else{
				res.status(200).send('ok');
			}
		});
	});

		app.post('/sendOutEmail', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}
		else {
			//console.log(req.body.ni);
			NL.printWithId( req.body.ni, function(e, news){
				sendOutEmail(news);
			})
		}
	});



	app.post('/updateNews', function(req, res){
		//console.log(req.body);
		NM.updateNews({
			id             : req.body.id,
			event_name 	   : req.body.en,
			event_duration : req.body.edur,
			event_type 	   : req.body.et,
			event_date     : req.body.ed,
			event_dec	   : req.body.dec,
		}, function(e, o){
			if (e){
				res.status(400).send('error-updating-account');
			}	else{
				res.status(200).send('ok');
			}
		});
	});

	app.post('/updateResident', function(req, res){
		RM.updateAccount({
			id          : req.body.id,
			firstname 	: req.body.fn,
			lastname 	: req.body.ln,
			email 		: req.body.email,
			address 	: req.body.address
		}, function(e, o){
			if (e){
				res.status(400).send('error-updating-account');
			}	else{
				res.status(200).send('ok');
			}
		});
	});


		app.post('/delResident', function(req, res){
		RM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});

		app.post('/delNews', function(req, res){
		NM.deleteNews(req.body.id, function(e, obj){
			if (!e){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});

		app.post('/delNewsletter', function(req, res){
		NL.deleteNewsletter(req.body.id, function(e, obj){
			if (!e){
				res.status(200).send('ok');
			}	else{
				res.status(400).send('record not found');
			}
	    });
	});
};


