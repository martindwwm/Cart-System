import {
  cart,
  removeFromCart,
  calculateCartQuantity,
  updateQuantity,
  updateDeliveryOption,
} from "../data/cart.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  const matchingProduct = products.find((product) => product.id === productId);

  // Check if the product exists
  if (!matchingProduct) {
    console.error(
      `Product with ID ${productId} not found in the product list.`
    );
    return;
  }

  const deliveryOptionId = cartItem.deliveryOptionId;

  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

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
          <p class="text-md text-red-600 font-bold mt-1 mb-2 js-price-${
            matchingProduct.id
          }">
            $${formatCurrency(matchingProduct.priceCents)}
          </p>

          <!-- Quantity Management -->
          <div class="flex items-center gap-2 text-md">
            <p class="items-quantity js-items-quantity-${
              matchingProduct.id
            }">Quantity: ${cartItem.quantity}</p>

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

          <!-- Total Cost -->
          <p class="text-gray-300 text-md mt-2 js-total-cost-${
            matchingProduct.id
          }">
            Total cost: $${formatCurrency(
              matchingProduct.priceCents * cartItem.quantity
            )}
          </p>
        </div>
      </div>

      <!-- Colonne 2 : Shipping option -->
      <div>
        <p class="font-bold text-lg mb-3">Choose a delivery option:</p>
        ${deliveryOptionsHtml(matchingProduct, cartItem)}
      </div>

    </div>
  </div>
  `;
});

function deliveryOptionsHtml(matchingProduct, cartItem) {
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
        <div class="flex items-center gap-3 mb-2 js-delivery-option"
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
            class="font-bold text-lg text-green-600">
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

document.querySelector(".js-render-products").innerHTML = cartSummaryHTML;

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
  })
);

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();

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
      itemsQuantity.innerHTML = `Quantity: ${newQuantity}`;
    }

    const priceCents = document.querySelector(
      `.js-price-${productId}`
    )?.textContent;

    const cleanedPriceCents = priceCents?.replace(/[^0-9]/g, "").trim();

    const priceCentsValue = Number(cleanedPriceCents);

    const newTotalCost = formatCurrency(priceCentsValue * newQuantity);

    document.querySelector(
      `.js-total-cost-${productId}`
    ).innerHTML = `Total cost : $${newTotalCost}`;

    const container = document.querySelector(
      `.js-render-products-container-${productId}`
    );
    container?.classList.remove("is-editing-quantity");

    updateCartQuantity();
  })
);

document.querySelectorAll(".js-delivery-option").forEach((element) => {
  element.addEventListener("click", () => {
    const { productId, deliveryOptionId } = element.dataset;

    updateDeliveryOption(productId, deliveryOptionId);
  });
});
