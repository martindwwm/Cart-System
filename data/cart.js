export let cart = JSON.parse(localStorage.getItem("cart")) || [
  {
    id: "MG-FIG-001-202300001",
    quantity: 1,
  },
  {
    id: "MG-FIG-002-602392074",
    quantity: 2,
  },
];

function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  const quantity = Number(quantitySelector.value);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
    });
  }

  saveToStorage();
}

function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (productId !== cartItem.productId) {
      cart = newCart;
    }
  });
  return newCart;

  saveToStorage();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}
