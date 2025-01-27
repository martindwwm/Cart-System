import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
} from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  // Trouver le produit correspondant
  const matchingProduct = products.find((product) => product.id === productId);

  // Vérifier si le produit correspondant existe
  if (!matchingProduct) {
    console.error(
      `Product with ID ${productId} not found in the product list.`
    );
    return;
  }

  // Générer le HTML pour le produit
  cartSummaryHTML += `
  <div class="js-render-products-container-${
    matchingProduct.id
  } bg-gray-900 p-4 rounded-lg shadow text-gray-300">
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <img
          src="${matchingProduct.image}"
          alt="${matchingProduct.name}"
          class="h-24 w-16 object-cover mr-4"
        />
        <div>
          <h2 class="text-xl font-bold">${matchingProduct.name}</h2>
          <p class="text-sm">Price : $${formatCurrency(
            matchingProduct.priceCents
          )}</p>
          <p class="text-sm items-quantity js-items-quantity-${
            matchingProduct.id
          }">Quantity : ${cartItem.quantity}</p>
          <p class="text-gray-300">
        total cost : $${formatCurrency(
          matchingProduct.priceCents * cartItem.quantity
        )}
      </p>
        </div>
      </div>
      <div>
        <p class="font-bold mb-2">Shipping Options:</p>
        <div class="mb-2">
          <input
            type="radio"
            id="${matchingProduct.id}_shipping1"
            name="shipping_${matchingProduct.id}"
            class="mr-2"
          />
          <label for="${matchingProduct.id}_shipping1"
            >Monday, January 23rd - $5.00</label
          >
        </div>
        <div class="mb-2">
          <input
            type="radio"
            id="${matchingProduct.id}_shipping2"
            name="shipping_${matchingProduct.id}"
            class="mr-2"
          />
          <label for="${matchingProduct.id}_shipping2"
            >Wednesday, January 25th - $3.00</label
          >
        </div>
        <div>
          <input
            type="radio"
            id="${matchingProduct.id}_shipping3"
            name="shipping_${matchingProduct.id}"
            class="mr-2"
          />
          <label for="${matchingProduct.id}_shipping3"
            >Friday, January 27th - $2.00</label
          >
        </div>
      </div>
    </div>
    <div>
      <a href="#" class="update-link text-blue-500 hover:underline js-update-link pr-1" data-product-id="${
        matchingProduct.id
      }">Update</a>
      <input class="quantity-input js-quantity-input-${
        matchingProduct.id
      } w-12 hidden rounded-sm bg-gray-100 text-black px-1 py-1">
      <span class="save-link-quantity js-save-link-quantity text-blue-500 pl-1 cursor-pointer hover:underline hidden" data-product-id="${
        matchingProduct.id
      }">Save</span>
      <a href="#" class="js-delete-link text-red-500 hover:underline ml-4" data-product-id="${
        matchingProduct.id
      }">Delete</a>
    </div>
  </div>
  `;
});

document.querySelector(".js-render-products").innerHTML = cartSummaryHTML;

document.querySelectorAll(".js-delete-link").forEach((link) =>
  link.addEventListener("click", () => {
    const { productId } = link.dataset;
    removeFromCart(productId);

    const container = document.querySelector(
      `.js-render-products-container-${productId} `
    );

    if (container) {
      container.remove();
    }

    updateCartQuantity();
  })
);

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

  document.querySelector(
    ".js-render-cart-quantity"
  ).innerHTML = `Cart Items : ${cartQuantity}`;
}
updateCartQuantity();

document.querySelectorAll(".js-update-link").forEach((link) =>
  link.addEventListener("click", () => {
    const { productId } = link.dataset;

    const container = document.querySelector(
      `.js-render-products-container-${productId}`
    );
    container?.classList.add("is-editing-quantity");
  })
);

document.querySelectorAll(".js-save-link-quantity").forEach((link) =>
  link.addEventListener("click", () => {
    const { productId } = link.dataset;

    const quantityInput = document.querySelector(
      `.js-quantity-input-${productId}`
    );

    const newQuantity = Number(quantityInput.value);

    if (newQuantity < 0 || newQuantity >= 1000) {
      alert("Quantity must be at least 0 and less than 1000");
      return;
    }

    updateQuantity(productId, newQuantity);

    const itemsQuantity = document.querySelector(
      `.js-items-quantity-${productId}`
    );

    if (itemsQuantity) {
      itemsQuantity.innerHTML = `Quantity: ${newQuantity}`;
    }

    const container = document.querySelector(
      `.js-render-products-container-${productId}`
    );
    container?.classList.remove("is-editing-quantity");

    updateCartQuantity();
  })
);
