import './style.css';
import {
  moduleData, filterActivities, parseInfo, sort,
} from './activity';
import moduleDom from './domMan';
import { validCheckRequired, validCheckExist } from './validation';

let filterHeader = 'Today';
// in landing page activities of today will be displayed
let currentFilter = 'filterActivitiesToday';

let parameter = 'date';
const getSortBy = (param) => {
  let displayActivitiesSorted = '';
  // this to sort displayed activities
  if (parseInfo.getDisplayActivities().length > 0) {
    if (param === 'title') {
      displayActivitiesSorted = parseInfo.getDisplayActivities().sort(sort.byTitle);
    } if (param === 'date') {
      displayActivitiesSorted = parseInfo.getDisplayActivities().sort(sort.byDate);
    } if (param === 'importance') {
      displayActivitiesSorted = parseInfo.getDisplayActivities().sort(sort.byImportance);
    }
  }
  return displayActivitiesSorted;
};

const saveButtonActivator = () => {
  const saveButton = document.querySelector('.popup.activity .buttons .save');
  // eslint-disable-next-line no-use-before-define
  saveButton.addEventListener('click', save);
};

const cancelButton = document.querySelector('.popup.activity .buttons .cancel');
cancelButton.addEventListener('click', () => {
  moduleDom.resetForm();
  saveButtonActivator();
});

const displayAndActivators = (() => {
  const deleteButtonActivator = () => {
    const deleteButtons = document.querySelectorAll('.todo .buttons button.remove');
    for (let i = 0; i < deleteButtons.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      deleteButtons[i].addEventListener('click', (e) => {
        let id = '';
        if (e.target.nodeName === 'BUTTON') {
          id = e.target.id;
        } else if (e.target.nodeName === 'svg') {
          id = e.target.parentNode.id;
        } else if ((e.target.nodeName === 'path')) {
          id = e.target.parentNode.parentNode.id;
        } else {
          id = e.target.parentNode.id;
        }

        moduleData.removeActivity(id);
        // incase of deleting an element of project, filter and show will need an projectName
        // since the activities filtered by project name, filterHeader parsed directly.
        // eslint-disable-next-line no-use-before-define
        filterAndShow(currentFilter, `${filterHeader}`);
      });
    }

    const deleteButton = document.querySelector('.popup .buttons .remove');
    if (deleteButton !== null) {
      deleteButton.addEventListener('click', (e) => {
        let id = '';
        if (e.target.nodeName === 'BUTTON') {
          id = e.target.id;
        } else {
          id = e.target.parentNode.id;
        }

        moduleData.removeActivity(id);
        // eslint-disable-next-line no-use-before-define
        filterAndShow(currentFilter, `${filterHeader}`);

        moduleDom.hideActivityWindow();
        saveButtonActivator();
      });
    }
  };

  const editButtonActivator = () => {
    const editButton = document.querySelector('.popup .buttons .edit');
    if (editButton !== null) {
      editButton.addEventListener('click', (e) => {
        let id = '';
        if (e.target.nodeName === 'BUTTON') {
          id = e.target.id;
        } else {
          id = e.target.parentNode.id;
        }

        if (validCheckRequired()) {
          moduleData.editActivity(id);
          moduleDom.hideActivityWindow();
          moduleDom.resetForm();
          // eslint-disable-next-line no-use-before-define
          filterAndShow(currentFilter, `${filterHeader}`);
          saveButtonActivator();
        }
      });
    }
  };

  const editButtonsActivator = () => {
    // this fuction to activate edit buttons on activity divisions
    const editButtons = document.querySelectorAll('.todo .buttons button.edit');
    const activities = parseInfo.getActivities();
    for (let i = 0; i < editButtons.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      editButtons[i].addEventListener('click', (e) => {
        // gets id data of which activity edit button is clicked.
        // Since event listener add by click, ther are three posibility for event to get;
        // button its self svg file on button and path in svg file for all three posibility,
        // to make sure returning data is correct id, which is id of button itsself
        let idData = '';
        if (e.target.nodeName === 'BUTTON') {
          idData = e.target.id;
        } else if (e.target.nodeName === 'svg') {
          idData = e.target.parentNode.id;
        } else if ((e.target.nodeName === 'path')) {
          idData = e.target.parentNode.parentNode.id;
        } else {
          idData = e.target.parentNode.id;
        }

        for (const act in activities) {
          // this == two let expression to work with different styles, since ids are numbers but returning from local storage as strings.
          if (idData == activities[act].id) {
            moduleDom.displayActivityEditable(activities[act].activity, activities[act].id);
          }
        }
        // after displaying activity popup window following two functions are needed to invoked for activating buttons on popup.
        // unlike delete button activator, edit button activators have two different functions. one for edit buttons in mainpage and other for the button in popupwindow.
        editButtonActivator();
        deleteButtonActivator();
      });
    }
  };

  const checkBoxActivator = () => {
    const currentActivitiesCheck = document.querySelectorAll('.todos .todo input[type="checkbox"]');
    for (let i = 0; i < currentActivitiesCheck.length; i += 1) {
      currentActivitiesCheck[i].addEventListener('change', (e) => {
        const idData = e.target.parentNode.id;
        if (e.target.checked) {
          moduleData.markActivityCompleted(idData);
        } else if (!e.target.checked) {
          moduleData.markActivityIncompleted(idData);
        }
        // eslint-disable-next-line no-use-before-define
        showActivities();
      });
    }
  };

  const titleActivator = () => {
    // when user clicks on activity title activity will be displayed.
    const currentActivities = document.querySelectorAll('.todos .todo a');
    for (let i = 0; i < currentActivities.length; i += 1) {
      // eslint-disable-next-line no-loop-func
      currentActivities[i].addEventListener('click', (e) => {
        const { id } = e.target;
        const activities = parseInfo.getActivities();
        // gets current activity list. checks to which activity that clicked title belongs. Then displays it
        for (const act in activities) {
          if (activities[act].id == id) {
            // activity will be read only. Only delete will be active
            moduleDom.displayActivityReadOnly(activities[act].activity, id);
          }
        }
        // this activates delete button on activity window.
        deleteButtonActivator();
      });
    }
  };

  const projectActivator = () => {
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

  const displayPerformanceIndex = (activityArray) => {
    const pi = document.querySelector('.performance-info-container .pi .result');
    const piRate = parseInfo.performanceAnalysis.pi(activityArray);
    pi.innerHTML = `${piRate}`;
    const ipi = document.querySelector('.performance-info-container .ipi .result');
    const ipiRate = parseInfo.performanceAnalysis.ipi(activityArray);
    ipi.innerHTML = `${ipiRate}`;
  };

  const displayStats = () => {
    const todayStat = document.querySelector('button.today span.stat');
    todayStat.innerHTML = `${parseInfo.stats.noOfActivitiesToday()}`;

    const thisWeekStat = document.querySelector('button.this-week span.stat');
    thisWeekStat.innerHTML = `${parseInfo.stats.noOfActivitiesThisWeek()}`;

    const allActivitiesStat = document.querySelector('button.all-activities span.stat');
    allActivitiesStat.innerHTML = `${parseInfo.stats.noOfActivitiesAll()}`;
  };

  // this function makes a lot! key function of all display. For architecture it doesnt look good.
  // should be seperated.
  function showActivities() {
    const mainContainer = document.querySelector('.todos');
    mainContainer.innerHTML = '';
    const header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = `${filterHeader}`;
    mainContainer.appendChild(header);

    const displayActivities = getSortBy(parameter);

    for (const act in displayActivities) {
      if (displayActivities[act] !== undefined) {
        moduleDom.createActivityDiv(displayActivities[act].activity, displayActivities[act].id, '.todos');
      }
    }

    const projects = parseInfo.getProjects();
    if (projects.length > 0) {
      moduleDom.displayProjects(projects);
    }
    // this activates project names for click event listener
    projectActivator();

    // this statement to make this lines works if there is an activity.
    if (displayActivities.length > 0) {
      titleActivator();
      checkBoxActivator();
      // this activates delete button for each activity division.
      // other delete button on popup window activated in function that calls popup.
      deleteButtonActivator();

      editButtonsActivator();

      displayPerformanceIndex(displayActivities);
    }
    displayStats();
    return true;
  }

  return {
    showActivities,
  };
})();

function filterAndShow(filter, arg) {
  filterActivities(filter, arg);
  displayAndActivators.showActivities();
}

function save() {
  if (validCheckRequired() && validCheckExist()) {
    // first validates form and then invokes save function fron activities module folder.
    moduleData.saveActivity();
    // when activity saved toggles popup display to off.
    moduleDom.hideActivityWindow();
    // reset forms. to clear values and class names for being invalid if exist
    moduleDom.resetForm();
    filterAndShow(currentFilter);
  }
}

const permanentButtonsActivator = () => {
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
};

// landing functions
filterAndShow(currentFilter);
saveButtonActivator();
permanentButtonsActivator();

const logo = document.querySelector('.header-container button.sample-data');
logo.addEventListener('click', () => {
  moduleData.callDefault();
  filterAndShow(currentFilter, `${filterHeader}`);
});
