import { format } from 'date-fns';

import startingData from './starting-data.csv';
// this array to cache activities during session
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

// to save activities on local storage
const saveToStorage = () => {
  localStorage.clear();

  for (let i = 0; i < activities.length; i += 1) {
    if (activities[i] !== undefined) {
      localStorage.setItem(`title${activities[i].id}`, `${activities[i].activity.title}`);
      localStorage.setItem(`description${activities[i].id}`, `${activities[i].activity.description}`);
      localStorage.setItem(`importance${activities[i].id}`, `${activities[i].activity.importance}`);
      localStorage.setItem(`date${activities[i].id}`, `${activities[i].activity.date}`);
      localStorage.setItem(`project${activities[i].id}`, `${activities[i].activity.project}`);
      localStorage.setItem(`notes${activities[i].id}`, `${activities[i].activity.notes}`);
      localStorage.setItem(`isCompleted${activities[i].id}`, `${activities[i].activity.isCompleted}`);
      localStorage.setItem(`id${activities[i].id}`, `${activities[i].id}`);
    }
  }
};

// since items in storage are sometimes deleted, to parse from local storage dirst checked for element with highest id.
// ids of element are also saved after property names. so an item with id of '14' is also 'title14' and title is a must for all activities.
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
// reads local storage. since some of the items are deleted and local storage doesnt work in same way array of activities do,
// read all data up to maksimum even the null ones. But function deletes those empty elements just after creating.
(function readStorage() {
  const length = getHighestIndex(localStorage);

  if (localStorage.length >= 8) {
    for (let i = 0; i <= length; i += 1) {
      const title = isNull(localStorage.getItem(`title${i}`));
      const description = isNull(localStorage.getItem(`description${i}`));
      const importance = isNull(localStorage.getItem(`importance${i}`));
      const date = isNullDate(localStorage.getItem(`date${i}`));
      const project = isNull(localStorage.getItem(`project${i}`));
      const notes = isNull(localStorage.getItem(`notes${i}`));
      const isCompleted = isNull(localStorage.getItem(`isCompleted${i}`));
      const id = isNull(localStorage.getItem(`id${i}`));
      const activity = new Activity(title, description, importance, date, project, notes, isCompleted);
      activities.push({ activity, id });
      if (title === '' || title === undefined) {
        activities.splice(activities.length - 1, 1);
      }
    }
  }
}());// since needed immediately in opening of page created IIFE

// module for data functions
const moduleData = (() => {
  const _getData = () => {
    const title = document.querySelector('input[name="title"]').value;
    const description = document.querySelector('input[name="description"]').value;
    const importance = document.querySelector('input[name="importance"]').value;
    const dateRaw = document.querySelector('input[type="date"]').value;
    const date = format(new Date(dateRaw), 'MM/dd/yyyy');
    const project = document.querySelector('input[name="project"]').value;
    const notes = document.querySelector('textarea[name="notes"]').value;

    return new Activity(title, description, importance, date, project, notes);
  };

  const _editData = (id) => {
    const title = document.querySelector('input[name="title"]').value;
    const description = document.querySelector('input[name="description"]').value;
    const importance = document.querySelector('input[name="importance"]').value;
    const dateRaw = document.querySelector('input[type="date"]').value;
    const date = format(new Date(dateRaw), 'MM/dd/yyyy');
    const project = document.querySelector('input[name="project"]').value;
    const notes = document.querySelector('textarea[name="notes"]').value;
    for (const act in activities) {
      if (activities[act].id == id) {
        activities[act].activity.title = title;
        activities[act].activity.description = description;
        activities[act].activity.importance = importance;
        activities[act].activity.date = date;
        activities[act].activity.project = project;
        activities[act].activity.notes = notes;
      }
    }
  };

  const saveActivity = () => {
    const activity = _getData();
    activities.push({ activity, id: activities.length });
    saveToStorage();
  };

  const editActivity = (id) => {
    _editData(id);
    localStorage.clear();
    saveToStorage();
    return activities;
  };

  const removeActivity = (id) => {
    for (const act in activities) {
      if (id == activities[act].id) {
        const index = activities.indexOf(activities[act]);
        activities.splice(index, 1);
      }
    }

    saveToStorage();
  };

  const markActivityCompleted = (idData) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const act in activities) {
      if (idData == activities[act].id) {
        activities[act].activity.isCompleted = true;
      }
    }
    saveToStorage();
  };

  const markActivityIncompleted = (idData) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const act in activities) {
      if (idData == activities[act].id) {
        activities[act].activity.isCompleted = false;
      }
    }
    saveToStorage();
  };

  // to call sample-data from imported starting-data.csv
  const callDefault = () => {
    for (let i = 1; i < startingData.length; i += 1) {
      const activity = new Activity(startingData[i][0], startingData[i][1], startingData[i][2], startingData[i][3], startingData[i][4], startingData[i][5], startingData[i][6]);
      activities.push({ activity, id: activities.length });
    }
    saveToStorage();
  };

  return {
    saveActivity,
    editActivity,
    removeActivity,
    markActivityCompleted,
    markActivityIncompleted,
    callDefault,
  };
})();

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

const parseInfo = (() => {
  const getDisplayActivities = () => displayActivities;

  const getActivities = () => activities;

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

  return {
    getActivities,
    getDisplayActivities,
    getProjects,

    performanceAnalysis,
    stats,

  };
})();

export {
  moduleData,
  filterActivities,
  parseInfo,
  sort,
};
