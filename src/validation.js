import { format } from 'date-fns';
import { getActivities } from './activity';

export default function validCheck() {
  const title = document.querySelector('input[name="title"]').value;
  const dateRaw = document.querySelector('input[type="date"]').value;
  const activities = getActivities();

  let validation = true;
  if (dateRaw === '') {
    const formRow = document.querySelector('.form-row.date');
    formRow.classList.add('invalid', 'nodata');
    validation = false;
  } else {
    const formRow = document.querySelector('.form-row.date');
    formRow.classList.remove('invalid', 'nodata');
  }

  if (title === '') {
    const formRow = document.querySelector('.form-row.title');
    formRow.classList.add('invalid', 'nodata');
    validation = false;
  } else {
    const formRow = document.querySelector('.form-row.title');
    formRow.classList.remove('invalid', 'nodata');
  }

  const existingTitles = activities.map((obj) => obj.activity.title);

  if (existingTitles.some((el) => el === title)) {
    const existingMatch = activities.filter((obj) => obj.activity.title === title);
    const existingMatchDates = existingMatch.map((obj) => obj.activity.date);
    if (dateRaw !== '') {
      const date = format(new Date(dateRaw), 'MM/dd/yyyy');
      if (existingMatchDates.some((el) => el === date)) {
        const formRow = document.querySelector('.form-row.title');
        formRow.classList.remove('nodata');
        formRow.classList.add('invalid', 'exist');
        validation = false;
      }
    }
  }

  return validation;
}
