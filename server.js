const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('flash');

// Setup webpack middleware...
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

// Get the Alfresco authentication and API routing dependencies...
const alfrescoAuthRouter = require('alfresco-auth-router');

// Create default port
const PORT = process.env.PORT || 3001;

// Create a new server
const server = express();

// Configure server
server.use(webpackDevMiddleware(compiler, {
  publicPath: '/' // Same as `output.publicPath` in most cases.
}));

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
passport.use(alfrescoAuthRouter.passportStrategy());
passport.serializeUser(alfrescoAuthRouter.serializeUser);
passport.deserializeUser(alfrescoAuthRouter.deserializeUser);
server.use('/auth', alfrescoAuthRouter.authRoutes(passport));
server.use('/proxy', alfrescoAuthRouter.apiRoutes());

// Create home route
server.get('/', (req, res) => {
  if (req.user) {
    return res.redirect('/dashboard');
  }
  return res.render('index');
});

server.get('/dashboard',
  alfrescoAuthRouter.isAuthenticated,
  (req, res) => {
    res.render('dashboard');
  }
);
// Start the server
server.listen(PORT, () => {
  console.log(`The API is listening on port ${PORT}`);
});