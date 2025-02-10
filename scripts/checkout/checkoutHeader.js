import { cart } from "../../data/cart.js";

export function renderCheckoutHeader() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const checkoutHeaderHTML = `
  <a href="index.html">
        <img class="w-20" src="images/Logo Martin.png" alt="logo" />
      </a>
      <a class="relative">
        <button class="relative p-2 rounded focus:outline-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-6 w-6 inline"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4 8H5L3 5H1"
            />
          </svg>
          <span
            id="cart-count"
            class="absolute top-0 right-0 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs js-render-cart-quantity"
          >${cartQuantity}</span>
        </button>
      </a>
  `;

  document.querySelector(".js-checkout-header").innerHTML = checkoutHeaderHTML;
}
