// productRecovery

const recovery = document.querySelector('[checkbox-multi]');

if (recovery) {
  const buttonItemRecovery = recovery.querySelectorAll(
    '[button-recovery-item]'
  );
  const formRecoveryItem = document.querySelector('#form-recovery-item');

  const path = formRecoveryItem.getAttribute('data-path');

  buttonItemRecovery.forEach((button) => {
    button.addEventListener('click', () => {
      const isConfirm = confirm('bạn có muốn khôi phục lại sản phẩm này?');

      if (isConfirm) {
        const data_id = button.getAttribute('data-id');

        const action = path + `/${data_id}?_method=PATCH`;
        formRecoveryItem.action = action;

        formRecoveryItem.submit();
      }
    });
  });
}

// End productRecovery
