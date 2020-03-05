const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const http = require('http');

const database = require('./util/database');
const connectionUtils = require('./util/connectionUtils');
const httpErrors = require('./util/httpErrors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const damageTypesRouter = require('./routes/damageTypes');
const conditionsRouter = require('./routes/conditions');
const featuresRouter = require('./routes/features');
const templatesRouter = require('./routes/participantTemplates');
const encountersRouter = require('./routes/encounters');

const responseCodes = require('./util/responseCodes');

const app = express();

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  console.log("I'm in production!");
  app.use(compression());
  app.use(helmet());
}
if (isDev) {
  console.log('Running dev server');
  app.use(logger('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/damageTypes', damageTypesRouter);
app.use('/conditions', conditionsRouter);
app.use('/features', featuresRouter);
app.use('/participantTemplates', templatesRouter);
app.use('/encounters', encountersRouter);


app.use(function(req, res, next) {
  throw httpErrors.pageNotFoundError();
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    responseCode: err.responseCode || responseCodes.INTERNAL_SERVER_ERROR,
    message: err.message,
    data: err.data
  });
});

const port = connectionUtils.normalizePort(process.env.PORT || '3001');
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('error', connectionUtils.onError);
server.on('listening', connectionUtils.onListening(server));
