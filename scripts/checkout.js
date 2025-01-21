import { cart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummaryHTML = "";

cart.forEach((cartItem) => {
  let matchingProduct;

  products.forEach((product) => {
    if (product.id === cartItem.productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
  <div class="product-cart-container js-product-cart-container-${
    matchingProduct.id
  } flex justify-between items-center p-4">
  <!-- Left: Product Info -->
  <div class="flex items-center space-x-4 w-2/3">
    <!-- Product Image -->
    <img
      src="${matchingProduct.image}"
      alt="Product"
      class="w-[90px]"
    />
    <!-- Product Details -->
    <div>
      <h2 class="text-lg font-semibold text-gray-700">${
        matchingProduct.name
      }</h2>
      <p class="text-gray-500">
        Price : 
        <span class="text-gray-800 font-bold">$${formatCurrency(
          matchingProduct.priceCents
        )}</span>
      </p>
      <div class="mt-2 flex items-center">
        <label class="mr-2 text-gray-600">Quantité :</label>
        <input
          type="number"
          min="1"
          value="${cartItem.quantity}"
          class="w-16 border rounded-md text-center text-gray-700 font-semibold"
        />
      </div>
      <p class="mt-2 text-gray-800 font-bold">
        Sous-total : $${formatCurrency(
          matchingProduct.priceCents * cartItem.quantity
        )}
      </p>
      <!-- Update and Delete Links -->
      <div class="mt-2 flex space-x-4">
        <a href="#" class="text-blue-500 hover:text-blue-700 font-medium">
          Update
        </a>
        <a href="#" class="js-delete-link text-red-500 hover:text-red-700 font-medium" data-product-id="${
          matchingProduct.id
        }">
          Delete
        </a>
      </div>
    </div>
  </div>

  <!-- Right: Delivery Options -->
  <div class="w-1/3">
    <p class="text-gray-600 font-medium mb-2">Options de livraison :</p>
    <div class="flex flex-col space-y-2">
      <label class="flex items-center">
        <input
          type="radio"
          name="delivery-option-${matchingProduct.id}"
        />
        <span>Standard (3-5 jours) - Gratuit</span>
      </label>
      <label class="flex items-center">
        <input
          type="radio"
          name="delivery-option-${matchingProduct.id}"
        />
        <span>Express (1-2 jours) - 5 €</span>
      </label>
      <label class="flex items-center">
        <input
          type="radio"
          name="delivery-option-${matchingProduct.id}"
        />
        <span>Premium (le lendemain) - 10 €</span>
      </label>
    </div>
  </div>
</div>
  `;

  document.querySelector(".js-render-product-cart").innerHTML = cartSummaryHTML;
});

document.querySelectorAll(".js-delete-link").forEach((link) =>
  link.addEventListener("click", () => {
    const { productId } = link.dataset;
    console.log(productId);
  })
);
