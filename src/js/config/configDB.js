import mongoose from 'mongoose';
import { MONGO_DB_URI, getEnv } from './config';

export default () =>
  new Promise((resolve, reject) => {
    mongoose.set('toObject', {
      getters: true,
      versionKey: false,
      transform: function(doc, ret) {
        delete ret._id;
        return ret;
      }
    });

    mongoose.connect(MONGO_DB_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      autoIndex: getEnv() !== 'prod'
    });

    const db = mongoose.connection;

    db.on('error', err => {
      console.error('connection error:', err);
      reject(err);
    });

    db.once('open', function() {
      console.log('Connected to database.');
      resolve(db);
    });
  });
