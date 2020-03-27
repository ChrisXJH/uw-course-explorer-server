import Fuse from 'fuse.js';
import { getCourses } from '../services/uwData/uwDataService';
import { getSubjects } from '../services/subject/subjectService';

const subjectOptions = {
  threshold: 0.05,
  distance: 10,
  keys: [
    {
      name: 'subject',
      weight: 0.9
    },
    {
      name: 'description',
      weight: 0.1
    }
  ]
};

const courseOptions = {
  threshold: 0.1,
  distance: 10,
  keys: [
    {
      name: 'tags',
      weight: 0.8
    },
    {
      name: 'title',
      weight: 0.2
    }
  ]
};

export default function(req, res) {
  const { query } = req.query;
  const subjectsPromise = getSubjects();
  const coursesPromise = getCourses();

  Promise.all([subjectsPromise, coursesPromise])
    .then(([subjects, courses]) => {
      courses = courses.map(course =>
        Object.assign({}, course, {
          tags: [
            `${course.subject} ${course.catalog_number}`,
            `${course.subject}${course.catalog_number}`
          ]
        })
      );

      const subjectFuse = new Fuse(subjects, subjectOptions);
      const courseFuse = new Fuse(courses, courseOptions);
      const subjectResults = subjectFuse.search(query).map(item => {
        item.type = 'subject';
        return item;
      });
      const courseResults = courseFuse.search(query).map(item => {
        item.type = 'course';
        return item;
      });

      return [...subjectResults, ...courseResults];
    })
    .then(result => res.send(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
}
