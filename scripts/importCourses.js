const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI;
const env = process.env.NODE_ENV;

function connectDB() {
  return new Promise((resolve, reject) => {
    mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      autoIndex: env !== 'prod'
    });

    const db = mongoose.connection;

    db.on('error', err => {
      console.error('connection error:', err);
      reject(err);
    });

    db.once('open', function () {
      console.log('Connected to database.');
      resolve(db);
    });
  });
}

const CourseSchema = new mongoose.Schema({
  courseCode: { type: String, index: true },
  subject: String,
  catalogNumber: String
});

const CourseModel = mongoose.model('Course', CourseSchema);

connectDB()
  .then(() => {
    const coursesData = require('./prerequisites-ALL.json');

    CourseModel.collection.drop();

    const promises = coursesData.map(course => {
      const newCourse = new CourseModel({
        courseCode: `${course.subject}${course.catalog_number}`,
        subject: course.subject,
        catalogNumber: course.catalog_number
      });

      return newCourse.save().catch(error => {
        console.error('Failed to import', course);
        console.error(error);
      });
    });

    return Promise.all(promises);
  })
  .then(results => {
    console.log('Done!');
  })
  .catch(err => {
    console.error('Failed to import courses.');
  });
