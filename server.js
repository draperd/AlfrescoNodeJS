const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const http = require('http');
const flash = require('flash');

// Create default port
const PORT = process.env.PORT || 3001;

// Create the default address of the Alfresco repository...
const REPO = process.env.REPOSITORY || 'localhost';
const REPO_PORT = process.env.REPOSITORY || 8080;

// Create a new server
const server = express();

// This is probably not a great way to do this, just trying to get something working...
const sessionTokens = {};

// Configure server
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(session({
   secret: process.env.SESSION_SECRET || 'awesomecookiesecret',
   resave: false,
   saveUninitialized: false
}));

server.use(flash());
server.use(express.static('public'));
server.use(passport.initialize());
server.use(passport.session());

server.set('views', './views');
server.set('view engine', 'pug');

// This sets up the passport authentication stategy for logging into Alfresco...
passport.use(new LocalStrategy(
  (username, password, done) => {

      // Create the expected data to login to the Alfresco repository...
      var postData = JSON.stringify({
         'username': username,
         'password': password
      });

      // Set up the basic request information to login...
      var options = {
         hostname: REPO, // TODO: Make configurable
         port: REPO_PORT,
         path: '/alfresco/service/api/login',
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
      };

      var req = http.request(options, (res) => {
         res.setEncoding('utf8');
         let rawData = '';
         res.on('data', (chunk) => {
            rawData += chunk;
         });
         res.on('end', () => {

            // A 200 response indicates a successful login...
            if (res.statusCode === 200)
            {
               let parsedData = JSON.parse(rawData);
               done(null, {
                  username: username,
                  ticket: parsedData.data.ticket
               });
            }
            else
            {
               done(null, false, { message: 'Authentication failure' });
            }
         });
      });

      req.on('error', (e) => {
         done(null, false, { message: 'Authentication failure' });
      });

      // write data to request body
      req.write(postData);
      req.end();
  }
));

// Handle the serializing and deserializing of the user data. The key piece of information
// is the session ticket which should be provided on login. The user data (including the 
// all import session ticket) is currently just stored in a local object in memory (there
// is probably a better approach for this but it works for now)...
passport.serializeUser((user, done) => {
   sessionTokens[user.username] = user;
   done(null, user.username);
});

passport.deserializeUser((username, done) => {
   var user = sessionTokens[username];
   done(null, user);
});

function isAuthenticated(req, res, next) {
  if (!req.user) {
    req.flash('error', 'You must be logged in.');
    return res.redirect('/');
  }
  return next();
}

// Create home route
server.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  return res.render('index');
});

server.get('/dashboard',
  isAuthenticated,
  (req, res) => {
    res.render('dashboard');
  }
);

// Create auth routes
const authRoutes = express.Router();

authRoutes.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/dashboard',
    failureFlash: true,
  })
);

server.use('/auth', authRoutes);


// Create API routes
const apiRoutes = express.Router();
apiRoutes.use(isAuthenticated);

apiRoutes.get('/*', (inReq, outRes) => {
   var options = {
      hostname: REPO,
      port: REPO_PORT,
      path: '/alfresco/service/api' + inReq.url + '?alf_ticket=' + inReq.user.ticket,
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   };

   var req = http.get(options, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
         rawData += chunk;
      });
      res.on('end', () => {
         if (res.statusCode === 200)
         {
            let parsedData = JSON.parse(rawData);
            outRes.json(parsedData);
         }
         else
         {
            console.log('Not ok: ', res.statusCode);
         }
      });
   });

   req.on('error', (e) => {
      console.log('Error: ', e);
   });
});

server.use('/api', apiRoutes);

// Start the server
server.listen(PORT, () => {
  console.log(`The API is listening on port ${PORT}`);
});