var nodemailer = require("nodemailer"); 

var smtpTransport = nodemailer.createTransport({
  host: "smtp.noumena.in",
  secure: false, // use SSL
  port: 25,
  auth: {
    user: "prashant.s@noumena.in",
    pass: "Ao^$V$f9"
  },
  tls: { rejectUnauthorized: false } //certification
});

function sendmail(to, subject, body) {
  var mailOptions = {
    from: "prashant.s@noumena.in",
    to: to,
    subject: subject,
    text: body
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: ", response);
    }
  });
}

module.exports = sendmail;
