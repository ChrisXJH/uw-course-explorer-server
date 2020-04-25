import { Schema, model } from 'mongoose';

export const CourseSchema = new Schema({
  subject: String,
  catalogNumber: String
});

export default model('Course', CourseSchema);
