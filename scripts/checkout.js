import { cart, removeFromCart } from "../data/cart.js";
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
          <p class="text-sm">Price: $${formatCurrency(
            matchingProduct.priceCents
          )}</p>
          <p class="text-sm">Quantity: ${cartItem.quantity}</p>
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
      <a href="#" class="text-blue-500 hover:underline">Update</a>
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
    document
      .querySelector(`.js-render-products-container-${productId} `)
      ?.remove();
  })
);
