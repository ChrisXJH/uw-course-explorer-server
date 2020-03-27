import express from 'express';
import { getPort, getEnv, getSecret } from './config/config';
import SubjectController from './controllers/subject/subjectController';
import CourseController from './controllers/course/courseController';
import TermController from './controllers/term/termController';
import UserController from './controllers/user/userController';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import configPassport from './config/configPassport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import configDB from './config/configDB';
import ConnectMongo from 'connect-mongo';
import handleQuery from './middleware/handleQuery';

configDB().then(dbConnection => {
  const app = express();
  const MongoStore = ConnectMongo(session);
  const port = getPort();

  app.use(bodyParser.json());
  app.use(cookieParser());

  const corsOptions = {
    credentials: true,
    origin: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'UPDATE', 'OPTIONS'],
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept'
    ]
  };

  app.use(cors(corsOptions));

  app.set('trust proxy', 1);
  app.use(
    session({
      secret: getSecret(),
      resave: false,
      saveUninitialized: false,
      cookie: { secure: getEnv() === 'prod', maxAge: 7 * 24 * 60 * 60 * 1000 },
      store: new MongoStore({
        mongooseConnection: dbConnection
      })
    })
  );

  configPassport();

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    const { method, url, body } = req;
    console.log(`${method} ${url}`);
    if (Object.keys(body).length > 0) {
      console.log(body);
      console.log();
    }
    next();
  });

  // routers
  app.use('/subject', SubjectController);
  app.use('/course', CourseController);
  app.use('/term', TermController);
  app.use('/user', UserController);
  app.get('/search', handleQuery);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
