const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const moment = require('moment');
const path = require('path');

const systemConfig = require('./config/system');
const database = require('./config/database');
const routeClient = require('./routes/client/index.route');
const routeAdmin = require('./routes/admin/index.route');

require('dotenv').config();

database.connect();

const app = express();
const port = process.env.PORT;

// variable locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

// Flash message

app.use(cookieParser('keyboard cat'));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

// End flash message

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

app.use(express.static(`${__dirname}/public`));

// TyniMCE

app.use(
  '/tinymce',
  express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);

// End tyniMCE

app.use(methodOverride('_method'));

// Routes
routeClient(app);
routeAdmin(app);

// error 404
app.use((req, res) => {
  res.status(404).render('client/pages/errors/404', {
    titlePage: '404 Not Found',
  });
})

app.listen(port, () => {
  console.log(`App listening on port ${port}...`);
});
