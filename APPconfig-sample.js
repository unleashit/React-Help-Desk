module.exports = {

  __API_URL__: 'http://localhost:3100/api',
  __SOCKET_IO_URL__: 'http://localhost:3100/help-desk',
  __SESSION_SECRET__: 'abc123',
  __SESSION_KEY__: 'rhd_session', // will be the name of the session cookie

  liveChat: {
    adminName: 'admin',
    adminPerPage: 10, // how many archived chats to load per page in control panel
    saveInterval: 10*60*1000, // once per 10 mins
    purgeInterval: 20*60*1000, // min time to persist in ram (20 mins)
    sendSMS: false // send SMS on new user registrations
  },

  // If the chat is offline, the user can send an email
  // optional, but needed if you want to receive the email
  // If you don't have an smtp server, you can use GMAIL
  // http://lifehacker.com/111166/how-to-use-gmail-as-your-smtp-server

  smtpConfig: {
    host: '{your_mail_host}',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: '{your_mail_user}',
      pass: '{your_mail_password}'
    }
  },

  mailoptions: {
    from: '{your_from_email}',
    to: '{your_to_email}',
    subject: 'New contact'
  },

  // optional - if sendSMS above is set to true, and you've set the SMTP config
  // you can receive an SMS when a user begins chat
  // very simple implementation uses email to text
  // See https://20somethingfinance.com/how-to-send-text-messages-sms-via-email-for-free/

  smsMailOptions: {
    from: '{your_from_email}',
    to: '{your_number@your_provider}',
    subject: 'New live chat user has registered'
  }
};