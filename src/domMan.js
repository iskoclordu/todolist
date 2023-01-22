import { format } from 'date-fns';
import { stats } from './activity';

const moduleDomFunctions = (() => {
  function _displayBlur() {
    const blurDiv = document.querySelector('.blur');
    blurDiv.style.display = 'block';
  }

  function _hideBlur() {
    const blurDiv = document.querySelector('.blur');
    blurDiv.style.display = 'none';
  }

  function _displayPopup() {
    const popupDiv = document.querySelector('.popup.activity');
    popupDiv.style.display = 'flex';
  }

  function _hidePopup() {
    const popupDiv = document.querySelector('.popup.activity');
    popupDiv.style.display = 'none';
  }

  function resetValidationClass() {
    const formRow = document.querySelector('.form-row.date');
    formRow.classList.remove('invalid', 'nodata');
    const formRow2 = document.querySelector('.form-row.title');
    formRow2.classList.remove('invalid', 'nodata', 'exist');
  }

  function resetForm() {
    const form = document.querySelector('.popup form');
    form.reset();
    resetValidationClass();
    const inputs = document.querySelectorAll('.popup form .form-row *');

    for (let i = 0; i < inputs.length; i += 1) {
      inputs[i].removeAttribute('value');
      inputs[i].removeAttribute('readonly');
    }
    const notes = document.querySelector('textarea[name="notes"]');
    notes.innerHTML = '';

    const buttonParent = document.querySelector('.popup .buttons');
    const deleteButton = document.querySelector('.popup .buttons .remove');
    if (deleteButton !== null) {
      const saveButton = document.createElement('button');
      saveButton.classList.add('save');
      buttonParent.replaceChild(saveButton, deleteButton);
      saveButton.innerHTML = 'Save';
    }
    const editButton = document.querySelector('.popup .buttons .edit');
    if (editButton !== null) {
      buttonParent.removeChild(editButton);
    }
  }

  function displayActivityWindow() {
    _displayPopup();
    _displayBlur();
  }

  function hideActivityWindow() {
    _hideBlur();
    _hidePopup();
    resetForm();
  }

  function createActivityDiv(activities, id, containerSelector) {
    const mainContainer = document.querySelector(containerSelector);

    const container = document.createElement('div');
    container.classList.add('todo');
    container.setAttribute('id', `${activities[id].id}`);
    container.setAttribute('importance', `${activities[id].activity.importance}`);
    mainContainer.appendChild(container);

    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    checkBox.setAttribute('name', 'completed');
    checkBox.setAttribute('id', 'completed');
    container.appendChild(checkBox);

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('info-container');
    container.appendChild(infoContainer);

    const title = document.createElement('a');
    title.setAttribute('id', `${activities[id].id}`);
    title.setAttribute('href', '#!');
    title.innerHTML = `${activities[id].activity.title}`;
    infoContainer.appendChild(title);

    if (activities[id].activity.project !== '') {
      const projectName = document.createElement('div');
      projectName.classList.add('project-name');
      projectName.innerHTML = `${activities[id].activity.project}`;
      infoContainer.appendChild(projectName);
    }

    const date = document.createElement('div');
    date.classList.add('date');
    date.innerHTML = `${activities[id].activity.date}`;
    infoContainer.appendChild(date);

    const description = document.createElement('div');
    description.classList.add('description');
    description.innerHTML = `${activities[id].activity.description}`;
    infoContainer.appendChild(description);

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    container.appendChild(buttons);

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    removeButton.setAttribute('id', `${activities[id].id}`);
    removeButton.innerHTML = '<svg " xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M18.05 33.05 24 27l6 6.05 2.35-2.4-5.95-6.05 5.95-6.05-2.35-2.4-6 6.05-5.95-6.05-2.4 2.4 6 6.05-6 6.05Zm-5 8.95q-1.2 0-2.1-.9-.9-.9-.9-2.1V10.5H8v-3h9.4V6h13.2v1.5H40v3h-2.05V39q0 1.2-.9 2.1-.9.9-2.1.9Zm21.9-31.5h-21.9V39h21.9Zm-21.9 0V39Z"/></svg>';
    buttons.appendChild(removeButton);

    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.setAttribute('id', `${activities[id].id}`);
    editButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M9 39h2.2l22.15-22.15-2.2-2.2L9 36.8Zm30.7-24.3-6.4-6.4 2.1-2.1q.85-.85 2.1-.85t2.1.85l2.2 2.2q.85.85.85 2.1t-.85 2.1Zm-2.1 2.1L12.4 42H6v-6.4l25.2-25.2Zm-5.35-1.05-1.1-1.1 2.2 2.2Z"/></svg>';
    buttons.appendChild(editButton);

    const todayStat = document.querySelector('button.today span.stat');
    todayStat.innerHTML = `${stats.noOfActivitiesToday()}`;

    const thisWeekStat = document.querySelector('button.this-week span.stat');
    thisWeekStat.innerHTML = `${stats.noOfActivitiesThisWeek()}`;

    const allActivitiesStat = document.querySelector('button.all-activities span.stat');
    allActivitiesStat.innerHTML = `${stats.noOfActivitiesAll()}`;

    if (activities[id].activity.isCompleted.toString() === 'true') {
      infoContainer.style.textDecoration = 'line-through';
      checkBox.setAttribute('checked', '');
    }
  }

  const displayActivityReadOnly = (activities, id) => {
    resetForm();
    const title = document.querySelector('input[name="title"]');
    title.setAttribute('value', `${activities[id].activity.title}`);
    title.setAttribute('readonly', '');
    const description = document.querySelector('input[name="description"]');
    description.setAttribute('value', `${activities[id].activity.description}`);
    description.setAttribute('readonly', '');
    const importance = document.querySelector('input[name="importance"]');
    importance.setAttribute('value', `${activities[id].activity.importance}`);
    importance.setAttribute('readonly', '');
    const date = document.querySelector('input[type="date"]');
    const dateRaw = activities[id].activity.date;
    const dateFormatted = format(new Date(dateRaw), 'yyyy-MM-dd');
    date.setAttribute('value', `${dateFormatted}`);
    date.setAttribute('readonly', '');
    const project = document.querySelector('input[name="project"]');
    project.setAttribute('value', `${activities[id].activity.project}`);
    project.setAttribute('readonly', '');
    const notes = document.querySelector('textarea[name="notes"]');
    notes.innerHTML = `${activities[id].activity.notes}`;
    notes.setAttribute('readonly', '');

    const buttonParent = document.querySelector('.popup .buttons');
    const saveButton = document.querySelector('.popup .buttons .save');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('remove');
    deleteButton.setAttribute('id', `${activities[id].id}`);
    deleteButton.innerHTML = 'Delete';
    buttonParent.replaceChild(deleteButton, saveButton);

    displayActivityWindow();
  };

  const displayActivityEditable = (activities, id) => {
    resetForm();
    const title = document.querySelector('input[name="title"]');
    title.setAttribute('value', `${activities[id].activity.title}`);

    const description = document.querySelector('input[name="description"]');
    description.setAttribute('value', `${activities[id].activity.description}`);

    const importance = document.querySelector('input[name="importance"]');
    importance.setAttribute('value', `${activities[id].activity.importance}`);

    const date = document.querySelector('input[type="date"]');
    const dateRaw = activities[id].activity.date;
    const dateFormatted = format(new Date(dateRaw), 'yyyy-MM-dd');
    date.setAttribute('value', `${dateFormatted}`);

    const project = document.querySelector('input[name="project"]');
    project.setAttribute('value', `${activities[id].activity.project}`);

    const notes = document.querySelector('textarea[name="notes"]');
    notes.innerHTML = `${activities[id].activity.notes}`;

    const buttonParent = document.querySelector('.popup .buttons');
    const saveButton = document.querySelector('.popup .buttons .save');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('remove');
    deleteButton.setAttribute('id', `${activities[id].id}`);
    deleteButton.innerHTML = 'Delete';
    buttonParent.replaceChild(deleteButton, saveButton);

    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.setAttribute('id', `${activities[id].id}`);
    editButton.innerHTML = 'Edit';
    buttonParent.appendChild(editButton);

    displayActivityWindow();
  };

  const displayProjects = (projects) => {
    const projectList = document.querySelector('.nav-projects .project-list');
    projectList.innerHTML = '';
    for (let i = 0; i < projects.length; i += 1) {
      const a = document.createElement('a');
      const projectStat = stats.noOfActivitiesProject(projects[i]).length;
      a.innerHTML = `${projects[i]} <span id=${projects[i]}>${projectStat}</span>`;
      a.setAttribute('id', `${projects[i]}`);
      a.setAttribute('href', '#!');
      projectList.appendChild(a);
    }
  };

  return {
    displayActivityWindow,
    hideActivityWindow,
    resetForm,
    createActivityDiv,
    displayActivityReadOnly,
    displayActivityEditable,
    displayProjects,
  };
})();

const openActivityPopup = document.querySelector('button.add-activity');
openActivityPopup.addEventListener('click', () => {
  moduleDomFunctions.displayActivityWindow();
  moduleDomFunctions.resetForm();
});

const closeActivityPopup = document.querySelector('.popup.activity .buttons .cancel');
closeActivityPopup.addEventListener('click', moduleDomFunctions.hideActivityWindow);

const callhidePopup = () => moduleDomFunctions.hideActivityWindow();
const callresetForm = () => moduleDomFunctions.resetForm();

const callCreateActivityDiv = (activities, id, containerSelector) => {
  moduleDomFunctions.createActivityDiv(activities, id, containerSelector);
};

const callDisplayProjects = (projects) => {
  moduleDomFunctions.displayProjects(projects);
};

const callDisplayActivityReadOnly = (act, id) => moduleDomFunctions.displayActivityReadOnly(act, id);
const callDisplayActivityEditable = (act, id) => moduleDomFunctions.displayActivityEditable(act, id);

export {
  callhidePopup,
  callresetForm,
  callCreateActivityDiv,
  callDisplayProjects,
  callDisplayActivityReadOnly,
  callDisplayActivityEditable,

};
