# React Help Desk
One-to-many live chat app with a React/Redux front end and Node.js back end. Uses socket.io and Sequelize to sync chats on a set interval to a database. The backend has a control panel that lets you manage multiple chats.

![Help Desk](/../screenshots/react-help-desk.png?raw=true "Optional Title")

### Features

* Realtime help desk style chat for one admin to one or more users
* React/Redux client, Node/Express server
* Control panel to administer multiple chats, archive and delete
* Indicates to the user if admin is online, and if not provides a contact form instead of chat
* Typing indicators and notification sounds for both user and admin 
* Option to send an SMS to the admin on new chat registration
* Batched database persistence on a set interval for better I/O performance
* Socket.io and Passport authentication and sessions for the admin
* Defaults to Mysql, but based on Sequelize so can easily be adapted to other SQL databases (NoSQL wouldn't be too much work if you refactor the DB layer)
* Modular (especially the client) and easy to integrate with an existing site

### Demo
https://jasongallagher.org

### Getting Started

Once you clone the project, you should first run `npm install` to download dependencies, then `npm run build` to compile assets into the dist folder. Next create a database and add the config files (see below). After that you can run `npm start` to launch a development server, or `npm run prod` to run the build process and start the server in production mode. By default the server runs on port 3100, so you should go to `http://localhost:3100` to view the app.

### Database
In order to actually run the project you need to create a database and add a couple configuration files. The app is optimized for Mysql, but it should work with any Database that Sequelize supports (see their [documentation](http://docs.sequelizejs.com/en/v3/)). If you are using PostgreSql, you will need to change the `_insert_chat_records` query because sequelize doesn't support an `ON DUPLICATE KEY UPDATE` equivent for PG (you could change it to a raw SQL query if you like). If you are using another db besides Mysql or PG, you'll need to add the appropriate Express session storage and configure it in `/server/services/sessions-config.js`.

For datatabase credentials, add a file called DBconfig.json in the root. Please see Sequelize [documentation](http://docs.sequelizejs.com/en/v3/), but here's a boiler plate which you can use. The curly braces are placeholders so be sure to remove and replace or you'll get syntax errors:

```
{
  "development": {
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{usually localhost}",
    "port": "{usually 3306}",
    "dialect": "{mysql|mariadb|sqlite|postgres|mssql}",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  },
  "staging": {
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{usually localhost}",
    "port": "{usually 3306}",
    "dialect": "{mysql|mariadb|sqlite|postgres|mssql}",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  },
  "production": {
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{usually localhost}",
    "port": "{usually 3306}",
    "dialect": "{mysql|mariadb|sqlite|postgres|mssql}",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  }
}
```
### Other Config
A second config file should be made in the root, called APPconfig.js. It's contents should be:

```
module.exports = {

    __API_URL__: 'http://localhost:3100/api', // replace with your site
    __SOCKET_IO_URL__: 'http://localhost:3100/help-desk', // replace with your site
    __SESSION_SECRET__: '{NotKeyBoardCat!}',
    __SESSION_KEY__: '{anythingYouLike}', // will be the name of the session cookie

    liveChat: {
        adminName: '{your name}',
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
    // very simple inplementation uses email to text
    // See https://20somethingfinance.com/how-to-send-text-messages-sms-via-email-for-free/

    smsMailOptions: {
        from: '{your_from_email}',
        to: '{your_number@your_provider}',
        subject: 'New live chat user has registered'
    }
};
```

The first time you run the project via `npm start` or `npm run prod`, if all goes well, it will add the tables to your database and you'll be good to go.

Note that because I started this on a non-React project, the control panel front end is plain javascript. On some future rainy day, I plan on refactoring it so all clientside JS is in React.

### Administration and Login

To access the admin to manage chats, you need to first add a user and then elevate its access level. To create a user, just go to `/signup` and create it. To elevate the user, go the `Users` table in the DB and change the access level to 3. Now you can login at `/login` (or the link in the header) with your user and access the control panel.
