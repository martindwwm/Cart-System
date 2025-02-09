import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import formatCurrency from "../utils/money.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product?.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption?.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  const paymentSummaryHTML = `
  <div class="bg-gray-900 text-gray-200 p-6 rounded-lg shadow-md mb-6">
            <h3 class="text-xl font-bold mb-4">Order Summary</h3>

            <div class="flex justify-between mb-2">
              <span>Items (${cartQuantity}):</span>
              <span class="font-semibold">
              $${formatCurrency(productPriceCents)}
              </span>
            </div>

            <div class="flex justify-between mb-2">
              <span>Shipping & handling:</span>
              <span class="font-semibold">
              $${formatCurrency(shippingPriceCents)}
              </span>
            </div>

            <hr class="border-gray-700 my-2" />

            <div class="flex justify-between mb-2">
              <span>Total before tax:</span>
              <span class="font-semibold">
              $${formatCurrency(totalBeforeTaxCents)}
              </span>
            </div>

            <div class="flex justify-between mb-4">
              <span>Estimated tax (10%):</span>
              <span class="font-semibold">
              $${formatCurrency(taxCents)}
              </span>
            </div>

            <hr class="border-gray-700 my-2" />

            <div
              class="flex justify-between text-xl font-bold text-red-500 mb-4"
            >
              <span>Order total:</span>
              <span>
              $${formatCurrency(totalCents)}
              </span>
            </div>

            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg w-full"
            >
              Place your order
            </button>
  `;

  document.querySelector(".js-payment-summary").innerHTML = paymentSummaryHTML;
}
