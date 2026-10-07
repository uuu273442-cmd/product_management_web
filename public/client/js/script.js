// Show alert

const showAlert = document.querySelector('[show-alert]');

if (showAlert) {
  const data_time = parseInt(showAlert.getAttribute('data-time'));

  const closeAlert = showAlert.querySelector('[close-alert]');

  closeAlert.addEventListener('click', () => {
    showAlert.classList.add('alert-hidden');
  });

  setTimeout(() => {
    showAlert.classList.add('alert-hidden');
  }, data_time);
}

// End Show alert
