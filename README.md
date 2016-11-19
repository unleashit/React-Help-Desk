# React Help Desk
One to many live chat app with a React/Redux front end and Node.js back end. Uses socket.io and Sequelize to sync chats on a set interval to a database. The backend has a control panel that lets you manage multiple chats.

Once you clone the project, you should first run `npm install` to download dependencies. Next create a database (see below). After that you can run `npm start` to launch a development server, or `npm run prod` to run the build process, produce the public (dist) folder and start the server. By default the server runs on port 3100, so you should go to `http://localhost:3100` to view the app.

### Database
In order to actually run the project you need to create a database and add a couple configuration files. The app is optimized for Mysql, but it should work with any Database that Sequelize supports (see their documentation). If you are using PostgreSql, you will need to change the _insert_chat_records query because sequelize doesn't support an `ON DUPLICATE KEY UPDATE` equivent for PG (you could change it to a raw SQL query if you like). 

For datatabase credentials, make add a file called DBconfig.json in the root. Here's the boiler plate which you can fill in with your details:

```
{
  "development": {
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{host}",
    "dialect": "{mysql|postgres|mssql|etc}",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  },
  "test": {
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{host}",
    "dialect": "mysql|postgres|mssql|etc",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  },
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{host}",
    "dialect": "mysql|postgres|mssql|etc",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  }
}
```
### Other Config
A second config file should be made in the root, called APPconfig.js. It's contents should be:

```
module.exports = {

    __API_URL__: '{localhost or your site}/api',
    __SOCKET_IO_URL__: '{localhost or your site}/live-chat',
    __SESSION_SECRET__: '{NotKeyBoardCat!}',
    __SESSION_KEY__: '{anythingYouLike}', // will be the name of the session cookie
    __GOOGLE_ANALYTICS__: '{your GA account}' // optional

    liveChat: {
        adminName: '{your name}',
        adminPerPage: 10, // how many archived chats to load per page in control panel
        saveInterval: 10*60*1000, // once per 10 mins
        purgeInterval: 20*60*1000, // min time to persist in ram (20 mins)
        sendSMS: false // send SMS on new user registrations
    },
    
   
    // If the chat is offline, the user can send an email
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
    }
    
    mailoptions: {
        from: '{your_from_email}',
        to: '{your_to_email}',
        subject: 'New contact'
    },
    
    // optional - if sendSMS above is set to true, and you've set the SMTP config
    // you can receive an SMS when a user begins chat
    // very simple inplementation uses email to text
    // See https://20somethingfinance.com/how-to-send-text-messages-sms-via-email-for-free/
    
    smsMailOptions: {
        from: '{your_from_email}',
        to: '{your_number@your_provider}', 
        subject: 'New live chat user has registered'
    },
};
```

The first time you run the project via `npm start` or `npm run prod`, if all goes well, it will add the tables to your database and you'll be good to go.

Note that because I started this on a non-react project, the control panel front-end is plain javascript. On some future rainy day, I plan on refactoring it so all clientside JS is in React.

### Administration and Login

To access the admin to manage chats, you need to first add a user and then elevate its access level. To create a user, just go to `/signup` and create it. To elevate the user, go the `Users` table in the DB and change the access level to 3. Now you can login at `/login` (or the link in the header) with your user and access the control panel.

