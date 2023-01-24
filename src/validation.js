import { format } from 'date-fns';
import { parseInfo } from './activity';

// validates form for the required inputs. Which are title and date.

export function validCheckRequired() {
  const title = document.querySelector('input[name="title"]').value;
  const dateRaw = document.querySelector('input[type="date"]').value;

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
  return validation;
}

// after modulating activity.js this updated this forgotten part of the validcheck.

// validates form to avoid the same activity title for the same day.
export function validCheckExist() {
  const title = document.querySelector('input[name="title"]').value;
  const dateRaw = document.querySelector('input[type="date"]').value;
  const activities = parseInfo.getActivities();
  const existingTitles = activities.map((obj) => obj.activity.title);
  let validation = true;

  if (existingTitles.some((el) => el === title)) {
    const existingMatch = activities.filter((obj) => obj.activity.title === title);
    const existingMatchDates = existingMatch.map((obj) => obj.activity.date);
    if (dateRaw !== '') {
      const date = format(new Date(dateRaw), 'MM/dd/yyyy');
      if (existingMatchDates.some((el) => el === date.toString())) {
        const formRow = document.querySelector('.form-row.title');
        formRow.classList.remove('nodata');
        formRow.classList.add('invalid', 'exist');
        validation = false;
      }
    }
  }
  return validation;
}
