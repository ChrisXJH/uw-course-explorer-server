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

const app = express();

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
    cookie: { secure: getEnv() === 'prod' }
  })
);
configPassport();

app.use(passport.initialize());
app.use(passport.session());

// routers
app.use('/subject', SubjectController);
app.use('/course', CourseController);
app.use('/term', TermController);
app.use('/user', UserController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
