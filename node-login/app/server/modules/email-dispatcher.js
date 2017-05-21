
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect(
{
	host 	    : process.env.EMAIL_HOST || 'Ssrs.reachmail.net',
	user 	    : process.env.EMAIL_USER || 'BLOCKCAP2\\smtp',
	password    : process.env.EMAIL_PASS || '_CorianderRhubarbAniseParsley!',
	ssl		    : true
});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : process.env.EMAIL_FROM || 'Blockcaptain Login <do-not-reply@gmail.com>',
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
}

EM.composeEmail = function(o)
//make into https pls
{
	var link = 'https://blockcapta.in/reset-password?e='+o.email+'&p='+o.pass;
	var html = "<html><body>";
		html += "Hi "+o.name+",<br><br>";
		html += "Your username is <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Click here to reset your password</a><br><br>";
		html += "Cheers,<br>";
		html += "Blockcaptain's Team<br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}
