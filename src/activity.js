import { format } from 'date-fns';

import startingData from './starting-data.csv';

const activities = [];

class Activity {
  constructor(title, description, importance, date, project, notes, isCompleted = false) {
    this.title = title;
    this.description = description;
    this.importance = importance;
    this.date = date;
    this.project = project;
    this.notes = notes;
    this.isCompleted = isCompleted;
  }
}

const saveToStorage = () => {
  localStorage.clear();
  for (let i = 0; i < activities.length; i += 1) {
    if (activities[i] !== undefined) {
      localStorage.setItem(`title${i}`, `${activities[i].activity.title}`);
      localStorage.setItem(`description${i}`, `${activities[i].activity.description}`);
      localStorage.setItem(`importance${i}`, `${activities[i].activity.importance}`);
      localStorage.setItem(`date${i}`, `${activities[i].activity.date}`);
      localStorage.setItem(`project${i}`, `${activities[i].activity.project}`);
      localStorage.setItem(`notes${i}`, `${activities[i].activity.notes}`);
      localStorage.setItem(`isCompleted${i}`, `${activities[i].activity.isCompleted}`);
    }
  }
};

const callDefault = () => {
  for (let i = 1; i < startingData.length; i += 1) {
    const activity = new Activity(startingData[i][0], startingData[i][1], startingData[i][2], startingData[i][3], startingData[i][4], startingData[i][5], startingData[i][6]);
    activities.push({ activity, id: activities.length });
  }
  console.table(activities);
  saveToStorage();
};

const logo = document.querySelector('.header-container .logo-container a span');
logo.addEventListener('click', () => {
  callDefault();
});

const getHighestIndex = (array) => {
  const arrayRaw = Object.getOwnPropertyNames(array);
  const arrayFiltered = arrayRaw.filter((string) => string.startsWith('title'));
  const arrayNumbersOnly = arrayFiltered.map((text) => text.slice(5));
  const numbersSorted = arrayNumbersOnly.sort((a, b) => a - b);
  const highestIndex = parseInt(numbersSorted[numbersSorted.length - 1], 10);

  return highestIndex;
};

const isNull = (value) => (value !== null ? value : '');
const isNullDate = (value) => (value !== null ? value : format(new Date(), 'MM/dd/yyyy'));

const readStorage = () => {
  console.log(localStorage);
  const length = getHighestIndex(localStorage);

  if (localStorage.length >= 7) {
    console.log(Math.round(localStorage.length / 7));
    for (let i = 0; i <= length; i += 1) {
      const title = isNull(localStorage.getItem(`title${i}`));
      const description = isNull(localStorage.getItem(`description${i}`));
      const importance = isNull(localStorage.getItem(`importance${i}`));
      const date = isNullDate(localStorage.getItem(`date${i}`));
      const project = isNull(localStorage.getItem(`project${i}`));
      const notes = isNull(localStorage.getItem(`notes${i}`));
      const isCompleted = isNull(localStorage.getItem(`isCompleted${i}`));
      const activity = new Activity(title, description, importance, date, project, notes, isCompleted);
      activities.push({ activity, id: activities.length });
      if (title === '' || title === undefined) {
        console.log(activities.length - 1);
        delete activities[activities.length - 1];
      }
    }
    console.log(activities);
  }
};

readStorage();

const moduleData = (() => {
  const getData = () => {
    const title = document.querySelector('input[name="title"]').value;
    const description = document.querySelector('input[name="description"]').value;
    const importance = document.querySelector('input[name="importance"]').value;
    const dateRaw = document.querySelector('input[type="date"]').value;
    const date = format(new Date(dateRaw), 'MM/dd/yyyy');
    const project = document.querySelector('input[name="project"]').value;
    const notes = document.querySelector('textarea[name="notes"]').value;

    return new Activity(title, description, importance, date, project, notes);
  };

  const editData = (indexNumber) => {
    const title = document.querySelector('input[name="title"]').value;
    const description = document.querySelector('input[name="description"]').value;
    const importance = document.querySelector('input[name="importance"]').value;
    const dateRaw = document.querySelector('input[type="date"]').value;
    const date = format(new Date(dateRaw), 'MM/dd/yyyy');
    const project = document.querySelector('input[name="project"]').value;
    const notes = document.querySelector('textarea[name="notes"]').value;

    activities[indexNumber].activity.title = title;
    activities[indexNumber].activity.description = description;
    activities[indexNumber].activity.importance = importance;
    activities[indexNumber].activity.date = date;
    activities[indexNumber].activity.project = project;
    activities[indexNumber].activity.notes = notes;
  };

  return {
    getData,
    editData,
  };
})();

const saveActivity = () => {
  const activity = moduleData.getData();
  activities.push({ activity, id: activities.length });
  saveToStorage();
};

const editActivity = (indexNumber) => {
  moduleData.editData(indexNumber);
  localStorage.clear();
  saveToStorage();
  return activities;
};

const moduleFilter = (() => {
  const allActivities = () => {
    const allActivitiesCache = [];
    for (let i = 0; i < activities.length; i += 1) {
      if (activities[i] !== undefined) { allActivitiesCache.push(activities[i]); }
    }
    return allActivitiesCache;
  };

  const filterActivitiesToday = () => activities.filter((obj) => obj.activity.date === format(new Date(), 'MM/dd/yyy'));

  const filterActivitiesThisWeek = () => {
    const today = format(new Date(), 'MM/dd/yyyy');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekFormatted = format(new Date(nextWeek), 'MM/dd/yyyy');
    // eslint-disable-next-line max-len
    return activities.filter((obj) => obj.activity.date <= nextWeekFormatted && obj.activity.date >= today);
  };

  const filterActivitiesByProject = (pN) => activities.filter((obj) => obj.activity.project === pN);

  return {
    allActivities,
    filterActivitiesToday,
    filterActivitiesThisWeek,
    filterActivitiesByProject,
  };
})();

const sort = (() => {
  const byTitle = (el1, el2) => {
    if (el1.activity.title < el2.activity.title) {
      return -1;
    }
    if (el1.activity.title > el2.activity.title) {
      return 1;
    } if (el1.activity.title === el2.activity.title) {
      // eslint-disable-next-line no-use-before-define
      return byDate(el1, el2);
    }
    return 0;
  };
  const byDate = (el1, el2) => {
    const act1Date = new Date(el1.activity.date);
    const act2Date = new Date(el2.activity.date);

    if (act1Date < act2Date) {
      return -1;
    }
    if (act1Date > act2Date) {
      return 1;
    } if (act1Date === act2Date) {
      return byTitle(el1, el2);
    }
    return 0;
  };

  const byImportance = (el1, el2) => {
    if (el1.activity.importance < el2.activity.importance) {
      return 1;
    }
    if (el1.activity.importance > el2.activity.importance) {
      return -1;
    } if (el1.activity.importance === el2.activity.importance) {
      return byDate(el1, el2);
    }
    return 0;
  };

  return {
    byDate,
    byImportance,
    byTitle,
  };
})();

let displayActivities = activities;

const filterActivities = (filter, arg) => {
  displayActivities = (moduleFilter[filter](arg));
};

// eslint-disable-next-line max-len
const getDisplayActivities = () => displayActivities;

const getProjects = () => {
  const arrayOfProjects = activities.map((obj) => obj.activity.project);
  function removeDuplicates(arr) {
    return arr.filter((
      item,
      index,
    ) => arr.indexOf(item) === index);
  }

  function removeNull(arr) {
    return arr.filter((project) => project !== '');
  }
  const array1 = removeDuplicates(arrayOfProjects);
  return removeNull(array1);
};

const removeActivity = (indexNumber) => {
  console.log(`this # is about to delete ${indexNumber + 1}`);
  delete activities[indexNumber];
  console.table(activities);

  saveToStorage();
  console.table(localStorage);
};

const markActivityCompleted = (indexNumber) => {
  activities[indexNumber].activity.isCompleted = true;
  saveToStorage();
};

const markActivityIncompleted = (indexNumber) => {
  activities[indexNumber].activity.isCompleted = false;
  saveToStorage();
};

const getActivities = () => activities;

const performanceAnalysis = (() => {
  const completedActivities = (array) => array.filter((obj) => obj.activity.isCompleted.toString() === 'true');

  const allActivities = (array) => array;

  const noOfCompletedActivities = (array) => completedActivities(array).length;

  const noOfTotalActivities = (array) => allActivities(array).length;

  const pi = (array) => Math.round((noOfCompletedActivities(array) * 100) / noOfTotalActivities(array)) / 100;

  const importanceCompActs = (array) => completedActivities(array).map((obj) => parseInt(obj.activity.importance, 10));

  const importanceAllActs = (array) => allActivities(array).map((obj) => parseInt(obj.activity.importance, 10));

  const gainedImportance = (array) => {
    if (importanceCompActs(array).length !== 0) {
      return importanceCompActs(array).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    } return 0;
  };
  const totalImportance = (array) => importanceAllActs(array).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const ipi = (array) => Math.round((gainedImportance(array) * 100) / totalImportance(array)) / 100;
  return {
    pi,
    ipi,
  };
})();

const stats = (() => {
  const noOfActivitiesToday = () => moduleFilter.filterActivitiesToday().length;

  const noOfActivitiesThisWeek = () => moduleFilter.filterActivitiesThisWeek().length;

  const noOfActivitiesAll = () => moduleFilter.allActivities().length;

  const noOfActivitiesProject = (pN) => moduleFilter.filterActivitiesByProject(pN);

  return {
    noOfActivitiesAll,
    noOfActivitiesToday,
    noOfActivitiesThisWeek,
    noOfActivitiesProject,
  };
})();

const getPi = (array) => performanceAnalysis.pi(array);

export {
  saveActivity,
  editActivity,
  getActivities,
  filterActivities,
  getDisplayActivities,
  getProjects,
  removeActivity,
  markActivityCompleted,
  markActivityIncompleted,
  getPi,
  performanceAnalysis,
  stats,
  sort,
};
