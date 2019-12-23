import express from 'express';
import { getPort } from './config/config';
import SubjectController from './controllers/subject/subjectController';
import CourseController from './controllers/course/courseController';
import TermController from './controllers/term/termController';
import cors from 'cors';

const app = express();

const port = getPort();

app.use(cors());

app.use('/subject', SubjectController);
app.use('/course', CourseController);
app.use('/term', TermController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
