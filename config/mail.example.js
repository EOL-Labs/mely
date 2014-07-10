exports.mailconfig = {
	// list of method types below
	method: "sendmail",
	// custom transport methods
	// https://github.com/andris9/Nodemailer#custom-transport-methods
	sendmail:{
		bin: '/usr/sbin/sendmail',
		from: '"Server Name" <no-reply@yourdomain.com>'
	}
};

// - SMTP
// - SES = Amazon SES
// - Sendmail
// - Pickup = Email Storage in a directory on your machine
// - Direct = Sending Emails directly to recipients MTA servers