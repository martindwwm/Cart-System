import {
  cart,
  removeFromCart,
  calculateQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    // Check if the product exists
    if (!matchingProduct) {
      console.error(
        `Product with ID ${productId} not found in the product list.`
      );
      return;
    }

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    // Generate HTML for the product
    cartSummaryHTML += `
  <div class="js-render-products-container-${
    matchingProduct.id
  } bg-gray-900 p-4 rounded-md shadow text-gray-300 mb-5">

    <!-- Delivery Date -->
    <h2 class="text-green-600 text-xl font-bold mb-4">
      Delivery date: ${dateString}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

      <!-- Colonne 1 : Produit et détails -->
      <div class="flex gap-4">
        <!-- Product Image -->
        <img
          src="${matchingProduct.image}"
          alt="${matchingProduct.name}"
          class="h-36 w-36 object-cover rounded-md"
        />

        <!-- Product Details -->
        <div>
          <h2 class="text-lg font-bold">${matchingProduct.name}</h2>
          <p class="text-md text-red-600 font-bold mt-2 mb-2 js-price-${
            matchingProduct.id
          }">
            $${formatCurrency(matchingProduct.priceCents)}
          </p>

          <!-- Quantity Management -->
          <div class="flex items-center gap-2 text-md">
            <p class="">Quantity: <span class="items-quantity js-items-quantity-${
              matchingProduct.id
            }">${cartItem.quantity}</span></p>

            <!-- New quantity input -->
            <input class="quantity-input js-quantity-input-${
              matchingProduct.id
            } w-12 hidden rounded-sm bg-gray-100 text-black px-1">

            <!-- Update link -->
            <a href="#" class="text-blue-500 hover:text-red-500 update-link js-update-link"
              data-product-id="${matchingProduct.id}">
              Update
            </a>

            <!-- Save link -->
            <span class="save-link-quantity js-save-link-quantity text-blue-500 pl-1 cursor-pointer hover:text-red-500 hidden" data-product-id="${
              matchingProduct.id
            }">Save
            </span>

            <!-- Delete link -->
            <a href="#" class="text-blue-500 hover:text-red-500 js-delete-link"
              data-product-id="${matchingProduct.id}">
              Delete
            </a>
          </div>
        </div>
      </div>

      <!-- Colonne 2 : Shipping option -->
      <div>
        <p class="font-bold text-lg mb-3">Choose a delivery option:</p>
        ${deliveryOptionHtml(matchingProduct, cartItem)}
      </div>
    </div>
  </div>
  `;
  });

  function deliveryOptionHtml(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");
      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="flex items-center gap-3 mb-2 cursor-pointer js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <!-- Input radio -->
        <input
          type="radio"
          ${isChecked ? "checked" : ""}
          id="${matchingProduct.id}_shipping_${deliveryOption.id}"
          name="shipping_${matchingProduct.id}"
          class="cursor-pointer w-5 h-5 accent-blue-600"
        />

        <!-- Texte aligné avec la radio -->
        <div>
          <label for="${matchingProduct.id}_shipping_${deliveryOption.id}" 
            class="font-bold cursor-pointer text-lg text-green-600">
            ${dateString}
          </label>
          <p class="text-gray-300 text-md">
          ${priceString} - Shipping
          </p>
        </div>
      </div>
    `;
    });

    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  // Application d'un évènement au click sur tous les liens delete, update et save
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
      renderPaymentSummary();
    })
  );

  function updateCartQuantity() {
    const cartQuantity = calculateQuantity();

    document.querySelector(
      ".js-render-cart-quantity"
    ).innerHTML = `${cartQuantity}`;
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
        itemsQuantity.innerHTML = newQuantity;
      }

      const container = document.querySelector(
        `.js-render-products-container-${productId}`
      );
      container?.classList.remove("is-editing-quantity");

      updateCartQuantity();
      renderPaymentSummary();
    })
  );

  document.querySelectorAll(".js-delivery-option").forEach((element) =>
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  );
}
