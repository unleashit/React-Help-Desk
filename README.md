# jasongallagher.org
Personal site and portfolio of Jason Gallagher

`Important Note: this code is NOT an open source. You have a right to view, or install a local copy for personal viewing only. You are not granted the right to use this in any other way, either for commercial or non-commercial reasons. You may not distribute this code. Please see the LICENSE file for more details.`

Once you clone the project, you should first run `npm install` to download dependencies. Next run `npm run build` to run the build process and produce the public (dist) folder.

### Database
In order to actually run the project you need to create a database (see Sequelize docs for DB options) and two configuration files. For datatabase credentials, make add a file called DBconfig.json in the root. Here's the boiler plate which you can fill in with your details:

```
{
  "development": {
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{host}",
    "dialect": "{mysql|postgres|etc}",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  },
  "test": {
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{host}",
    "dialect": "mysql|postgres|etc",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  },
    "username": "{db_username}",
    "password": "{db_password}",
    "database": "{db_name}",
    "host": "{host}",
    "dialect": "mysql|postgres|etc",
    "charset": "utf8",
    "collate": "utf8_unicode_ci"
  }
}
```
### App Config
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
        saveInterval: 1*60*1000, // once per 15 mins
        purgeInterval: 2*60*1000, // min time to persist in ram (1 hr)
        sendSMS: false // send SMS on new user registrations
    },
    
    // optional
    mailoptions: {
        from: '{your_from_email}',
        to: '{your_to_email}',
        subject: 'New contact'
    },
    
    // optional
    smtpConfig: {
        host: '{your_mail_host}',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: '{your_mail_user}',
            pass: '{your_mail_password}'
        }
    }
    
    // optional
    // See https://20somethingfinance.com/how-to-send-text-messages-sms-via-email-for-free/
    smsMailOptions: {
        from: '{your_from_email}',
        to: '{your_number@your_provider}', 
        subject: 'New live chat user has registered'
    },
};
```
All keys should exist, but if optional can have any value. `mailoptions` and `smtpConfig` are for the contact form and are optional unless you want it to work... The contact form will both send an email and add a new record in the DB. I didn't bother to make a GUI for contacts, but may at some point.`smsMailOptions` can send a text notification when a user logs into chat.

To automatically add the database schema to your empty DB, open up /server/app.js. In the bottom of the file, under the models.sequelize.sync call, TEMPORARILY change "force" to "true". The first time you run the project via `npm start` or `npm run prod`, if all goes well, it will add the tables. IMPORTANT: don't forget to change "force" back to "false" after you successfully add the schema or else next time your run it will wipe your DB clean!

After this, you can now run the project in dev mode via `npm start` (a browser-sync will automatically launch a browser with webpack hot reload) or in production via `npm run prod`. The URL for the production build is http://localhost:3100 (instead of port 3000 for browser-sync).

### Administration and Login

To acess the admin to manage chats and the portfolio, you need to add a user and then elevate its access level. To create a user, just go to /signup and create it. To elevate the user, go into the DB and change the access level to 3. Now you can login at /login with your user and access the control panel. One caveat that I plan on fixing on some rainy day: you must run `npm run build` or `npm run prod` in the terminal after you add projects to view their images. Webpack is needed for now to optimize and copy the uploaded images to the public folder.


`Reminder: this code/theme/site is NOT open source. You have DO NOT have permission to use it for any other purpose except for your own personal viewing. Please see license file for further details.`

