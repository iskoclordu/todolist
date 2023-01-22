import './style.css';
// import { format, compareAsc } from 'date-fns';
import {
  saveActivity, editActivity, filterActivities, getDisplayActivities,
  getProjects, removeActivity, markActivityCompleted,
  markActivityIncompleted,
  getActivities, performanceAnalysis, sort,
} from './activity';
// eslint-disable-next-line import/no-cycle
import {
  callhidePopup, callresetForm, callCreateActivityDiv, callDisplayProjects,
  callDisplayActivityReadOnly, callDisplayActivityEditable,
} from './domMan';
import { validCheckRequired, validCheckExist } from './validation';

let filterHeader = 'Today';
let currentFilter = 'filterActivitiesToday';

let displayActivitiesSorted = getDisplayActivities().sort(sort.byDate);

let parameter = 'date';
const getSortBy = (param) => {
  if (getDisplayActivities().length > 0) {
    if (param === 'title') {
      displayActivitiesSorted = getDisplayActivities().sort(sort.byTitle);
    } if (param === 'date') {
      displayActivitiesSorted = getDisplayActivities().sort(sort.byDate);
    } if (param === 'importance') {
      displayActivitiesSorted = getDisplayActivities().sort(sort.byImportance);
    }
  }
};

const projectListener = () => {
  const projects = document.querySelectorAll('.nav-container .nav-projects .project-list a');
  for (let i = 0; i < projects.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    projects[i].addEventListener('click', (e) => {
      const projectName = e.target.id;
      filterHeader = projectName;
      currentFilter = 'filterActivitiesByProject';
      // eslint-disable-next-line no-use-before-define
      filterAndShow(currentFilter, `${projectName}`);
    });
  }
};

const saveButtonActivator = () => {
  const saveButton = document.querySelector('.popup.activity .buttons .save');
  // eslint-disable-next-line no-use-before-define
  saveButton.addEventListener('click', save);
};

const cancelButton = document.querySelector('.popup.activity .buttons .cancel');
cancelButton.addEventListener('click', () => {
  callresetForm();
  saveButtonActivator();
});

const deleteButtonActivator = () => {
  const deleteButtons = document.querySelectorAll('.todo .buttons button.remove');
  for (let i = 0; i < deleteButtons.length; i += 1) {
    // eslint-disable-next-line no-loop-func
    deleteButtons[i].addEventListener('click', (e) => {
      let indexNumber = '';
      if (e.target.nodeName === 'BUTTON') {
        indexNumber = e.target.id;
      } else if (e.target.nodeName === 'svg') {
        indexNumber = e.target.parentNode.id;
      } else if ((e.target.nodeName === 'path')) {
        indexNumber = e.target.parentNode.parentNode.id;
      } else {
        indexNumber = e.target.parentNode.id;
      }
      console.log(indexNumber);

      removeActivity(indexNumber);
      // eslint-disable-next-line no-use-before-define
      filterAndShow(currentFilter);
      saveButtonActivator();
    });
  }

  const deleteButton = document.querySelector('.popup .buttons .remove');
  if (deleteButton !== null) {
    deleteButton.addEventListener('click', (e) => {
      let indexNumber = '';
      if (e.target.nodeName === 'BUTTON') {
        indexNumber = e.target.id;
      } else {
        indexNumber = e.target.parentNode.id;
      }

      removeActivity(indexNumber);
      // eslint-disable-next-line no-use-before-define
      filterAndShow(currentFilter);

      callhidePopup();
      saveButtonActivator();
    });
  }
};

const editButtonActivator = () => {
  const editButton = document.querySelector('.popup .buttons .edit');
  if (editButton !== null) {
    editButton.addEventListener('click', (e) => {
      let indexNumber = '';
      if (e.target.nodeName === 'BUTTON') {
        indexNumber = e.target.id;
      } else {
        indexNumber = e.target.parentNode.id;
      }

      if (validCheckRequired()) {
        editActivity(indexNumber);
        callhidePopup();
        callresetForm();
        // eslint-disable-next-line no-use-before-define
        filterAndShow(currentFilter);
        saveButtonActivator();
      }
    });
  }
};

function showActivities() {
  const mainContainer = document.querySelector('.todos');
  mainContainer.innerHTML = '';
  const header = document.createElement('div');
  header.classList.add('header');
  header.innerHTML = `${filterHeader}`;
  mainContainer.appendChild(header);
  console.log(getDisplayActivities());
  getSortBy(parameter);
  const displayActivities = displayActivitiesSorted;
  console.log(displayActivitiesSorted);
  for (let i = 0; i < displayActivities.length; i += 1) {
    if (displayActivities[i] !== undefined) {
      callCreateActivityDiv(displayActivities, i, '.todos');
    }
  }

  const projects = getProjects();
  if (projects.length > 0) {
    callDisplayProjects(projects);
  }

  projectListener();

  deleteButtonActivator();

  if (displayActivities.length > 0) {
    const currentActivities = document.querySelectorAll('.todos .todo a');
    for (let i = 0; i < currentActivities.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      currentActivities[i].addEventListener('click', (e) => {
        const idData = e.target.id;
        const activities = getActivities();
        callDisplayActivityReadOnly(activities, idData);
        deleteButtonActivator();
      });
    }

    const currentActivitiesCheck = document.querySelectorAll('.todos .todo input[type="checkbox"]');
    for (let i = 0; i < currentActivitiesCheck.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      currentActivitiesCheck[i].addEventListener('change', (e) => {
        const idData = e.target.parentNode.id;
        if (e.target.checked) {
          markActivityCompleted(idData);
          showActivities();
        } else if (!e.target.checked) {
          markActivityIncompleted(idData);
          showActivities();
        }
      });
    }

    const editButtons = document.querySelectorAll('.todo .buttons button.edit');
    const activities = getActivities();
    for (let i = 0; i < editButtons.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      editButtons[i].addEventListener('click', (e) => {
        let indexNumber = '';
        if (e.target.nodeName === 'BUTTON') {
          indexNumber = e.target.id;
        } else if (e.target.nodeName === 'svg') {
          indexNumber = e.target.parentNode.id;
        } else if ((e.target.nodeName === 'path')) {
          indexNumber = e.target.parentNode.parentNode.id;
        } else {
          indexNumber = e.target.parentNode.id;
        }

        callDisplayActivityEditable(activities, indexNumber);
        editButtonActivator();
        deleteButtonActivator();
      });
    }

    const pi = document.querySelector('.performance-info-container .pi .result');
    const piRate = performanceAnalysis.pi(displayActivities);
    pi.innerHTML = `${piRate}`;
    const ipi = document.querySelector('.performance-info-container .ipi .result');
    const ipiRate = performanceAnalysis.ipi(displayActivities);
    ipi.innerHTML = `${ipiRate}`;
  } else {
    const pi = document.querySelector('.performance-info-container .pi .result');
    const ipi = document.querySelector('.performance-info-container .ipi .result');
    pi.innerHTML = '0';
    ipi.innerHTML = '0';
  }
  return true;
}

function filterAndShow(filter, arg) {
  filterActivities(filter, arg);
  showActivities();
}

function save() {
  if (validCheckRequired() && validCheckExist()) {
    saveActivity();
    callhidePopup();
    callresetForm();
    filterAndShow(currentFilter);
  }
}

const todayButton = document.querySelector('.nav-container button.today');
todayButton.addEventListener('click', () => {
  filterHeader = 'Today';
  currentFilter = 'filterActivitiesToday';
  filterAndShow(currentFilter);
});

const thisWeekButton = document.querySelector('.nav-container button.this-week');
thisWeekButton.addEventListener('click', () => {
  filterHeader = 'This Week';
  currentFilter = 'filterActivitiesThisWeek';
  filterAndShow(currentFilter);
});

const allActivitiesButton = document.querySelector('.nav-container button.all-activities');
allActivitiesButton.addEventListener('click', () => {
  filterHeader = 'All';
  currentFilter = 'allActivities';
  filterAndShow(currentFilter);
});

const sortSelect = document.querySelector('.sort-choose select');
sortSelect.addEventListener('change', (e) => {
  parameter = e.target.value;
  getSortBy(parameter);
  filterAndShow(currentFilter);
});

filterAndShow(currentFilter);
saveButtonActivator();
