const express = require('express');
const router = express.Router();

const jsforce = require('jsforce');
const conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl: 'https://curious-panda-thload-dev-ed.my.salesforce.com'
});

const USERNAME = 'carlosalvarez_86@curious-panda-thload.com';
const PASSWORD = 'password_token';


router.get('/', (req, res, next) => {
    conn.login(USERNAME, PASSWORD, function (err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        conn.query("SELECT Id, Name FROM Account", function (err, result) {
            if (err) { return console.error(err); }
            console.log("total : " + result.totalSize);
            console.log("fetched : " + result.records.length);
            res.send({registros: result.records, result })
        });
    });
});


var oauth2 = new jsforce.OAuth2({
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : process.env.HOST || 'https://curious-panda-thload-dev-ed.my.salesforce.com',
    clientId : process.env.CLIENT_ID || 'client_id',
    clientSecret : process.env.CLIENT_SECRET || 'client_secret',
    redirectUri : process.env.REDIRECT_URI || 'http://localhost:3000/sfdc/cb'
  });
  
  router.get('/oauth2', function(req, res) {
    res.redirect(oauth2.getAuthorizationUrl({}));
  });

  router.get('/cb', function(req, res) {
    var conn = new jsforce.Connection({ oauth2 : oauth2 });
    var code = req.param('code');
    console.log({req})
    conn.authorize(code, function(err, userInfo) {
      if (err) { return console.error(err); }
      // Now you can get the access token, refresh token, and instance URL information.
      // Save them to establish connection next time.
      console.log(conn.accessToken);
      console.log(conn.refreshToken);
      console.log(conn.instanceUrl);
      console.log("User ID: " + userInfo.id);
      console.log("Org ID: " + userInfo.organizationId);
      // ...
      res.send('success'); // or your desired response

    //   var conn = new jsforce.Connection({
    //     instanceUrl : 'https://curious-panda-thload-dev-ed.my.salesforce.com',
    //     accessToken : 'conn.accessToken'
    //   });
    });
  });


module.exports = router;
