const tablePermission = document.querySelector('[table-permission]');

if (tablePermission) {
  const buttonSubmit = document.querySelector('[button-submit]');
  const dataTable = tablePermission.querySelectorAll('[data-name]');
  const formControl = document.querySelector('[form-control]');

  buttonSubmit.addEventListener('click', () => {
    const permission = [];

    dataTable.forEach((item) => {
      const dataName = item.getAttribute('data-name');
      const inputs = item.querySelectorAll('input');
      if (dataName === 'id') {
        inputs.forEach((input) => {
          permission.push({
            id: input.value,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          if (input.checked) {
            permission[index].permissions.push(dataName);
          }
        });
      }
    });
    const getValue = formControl.querySelector('#permissions');
    getValue.value = JSON.stringify(permission);
    formControl.submit();
  });
}

const dataRecords = document.querySelector('[data-records]');

if (dataRecords) {
  const data = JSON.parse(dataRecords.getAttribute('data-records'));
  const tablePermission = document.querySelector('[table-permission]');

  data.forEach((item, index) => {
    const permission = item.permissions;

    permission.forEach((item) => {
      const row = tablePermission.querySelector(`[data-name='${item}']`);
      const checkbox = row.querySelectorAll('input')[index];

      checkbox.checked = true;
    });
  });
}
