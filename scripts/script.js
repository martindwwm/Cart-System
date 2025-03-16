import { cart, addToCart, calculateQuantity } from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from "../scripts/utils/money.js";

let productHTML = "";

products.forEach((product) => {
  productHTML += `
  <div
            class="product-container h-[400px] w-[270px] bg-transparent rounded-xl flex flex-col items-center gap-2"
          >
            <div class="figurine-image w-[300px]">
              <img
                class="w-full"
                src="${product.image}"
                alt="product 1"
              />
            </div>

            <div class="figurine name text-white">
              <p>${product.name}</p>
            </div>

            <div class="figurine-rating flex gap-1">
              <img
                class="w-[100px]"
                src="${product.getStarsUrl()}"
                alt="5 stars"
              />

              <p class="count text-orange-500">${product.ratings.count}</p>
            </div>

            <div class="figurine-price text-white text-lg font-bold">
              <p>${product.getPrice()}</p>
            </div>

            <div class="quantity-selector">
              <select class="js-quantity-selector-${
                product.id
              } bg-gray-100 rounded-lg">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            <div
              class="js-added-message-${
                product.id
              } flex items-center text-green-700 gap-1 opacity-0"
            >
              <img class="w-5" src="images/icons/checkmark.png" alt="valid" />

              <p>Added</p>
            </div>

            <div class="add-to-cart">
              <button
                class="js-add-to-cart bg-orange-400 w-40 h-8 rounded-full hover:bg-orange-500 text-white" data-product-id="${
                  product.id
                }"
              >
                Add To Cart
              </button>
            </div>
          </div>
  `;
});

document.querySelector(".js-render-products").innerHTML = productHTML;

document.querySelectorAll(".js-add-to-cart").forEach((button) => {
  const addedMessageTimeouts = {};

  function revealAddedMessage(productId) {
    const addedMessage = document.querySelector(
      `.js-added-message-${productId}`
    );
    addedMessage.style.opacity = "1";

    const previousTimeoutId = addedMessageTimeouts[productId];
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId);
    }

    const timeout = setTimeout(() => {
      addedMessage.style.opacity = "0";
    }, 2000);

    addedMessageTimeouts[productId] = timeout;
  }

  function updateCartQuantity() {
    const cartQuantity = calculateQuantity();

    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
  }

  button.addEventListener("click", () => {
    const { productId } = button.dataset;
    addToCart(productId);
    updateCartQuantity();
    revealAddedMessage(productId);
  });
});
