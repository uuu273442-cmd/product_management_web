// Change Status
const buttonChangeStatus = document.querySelectorAll('[button-change-status]');

if (buttonChangeStatus) {
  buttonChangeStatus.forEach((button) => {
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');

    button.addEventListener('click', () => {
      const currentStatus = button.getAttribute('data-status');
      const id = button.getAttribute('data-id');

      const changeStatus = currentStatus === 'active' ? 'inactive' : 'active';

      const action = path + `/${changeStatus}/${id}?_method=PATCH`;
      formChangeStatus.action = action;
      formChangeStatus.submit();
    });
  });
}

// End Change Status
