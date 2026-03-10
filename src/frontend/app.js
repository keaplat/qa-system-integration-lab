const state = {
  selectedProductId: ''
};

const productList = document.getElementById('product-list');
const selectedProductInput = document.getElementById('selected-product');
const emailInput = document.getElementById('email');
const quantityInput = document.getElementById('quantity');
const checkoutForm = document.getElementById('checkout-form');
const validationMessage = document.querySelector('[data-testid="validation-message"]');
const confirmationMessage = document.querySelector('[data-testid="confirmation"]');

async function loadProducts() {
  const response = await fetch('/api/products');
  const products = await response.json();

  productList.innerHTML = '';

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.testid = 'product-card';
    card.innerHTML = `
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button type="button">Select</button>
    `;

    card.querySelector('button').addEventListener('click', () => {
      state.selectedProductId = product.id;
      selectedProductInput.value = product.name;
      validationMessage.textContent = '';
      confirmationMessage.textContent = '';
    });

    productList.appendChild(card);
  });
}

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  validationMessage.textContent = '';
  confirmationMessage.textContent = '';

  if (!state.selectedProductId) {
    validationMessage.textContent = 'Select a product before checkout.';
    return;
  }

  if (!emailInput.validity.valid) {
    validationMessage.textContent = 'Enter a valid email address.';
    return;
  }

  const quantity = Number(quantityInput.value);

  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: emailInput.value,
      productId: state.selectedProductId,
      quantity
    })
  });

  const body = await response.json();

  if (!response.ok) {
    validationMessage.textContent = body.message ?? body.error ?? 'Unexpected error.';
    return;
  }

  confirmationMessage.textContent = `Order #${body.orderId} confirmed for ${body.productName}. Total: $${body.total}.`;
});

void loadProducts();
