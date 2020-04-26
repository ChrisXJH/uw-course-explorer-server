import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  displayName: String,
  created: { type: Date, default: Date.now },
  oauth: [
    {
      provider: { type: String, index: true },
      id: { type: String, index: true }
    }
  ],
  shortlistedCourses: {
    type: [{ type: String }],
    default: []
  },
  coursesTaken: {
    type: [{ type: String }],
    default: []
  }
});

userSchema.set('toObject', {
  transform: function (doc, ret) {
    const courseMap = require('../../data/courseMap.json');

    ret.coursesTaken = ret.coursesTaken.map(course => {
      const courseObj = courseMap[course];
      if (!courseObj) return {};

      return {
        title: courseObj.title,
        subject: courseObj.subject,
        catalogNumber: courseObj.catalogNumber
      };
    });
    return ret;
  }
});

export default model('User', userSchema);
