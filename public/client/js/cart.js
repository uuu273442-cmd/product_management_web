const cart = document.querySelectorAll('input[name="quantity"]');
if (cart.length > 0) {
  cart.forEach((item) => {
    item.addEventListener('change', (e) => {
      const quantity = item.value;
      const productId = item.getAttribute('item-id');
      window.location.href = `/cart/update/${productId}/${quantity}`;
    });
  });
}