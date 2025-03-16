import formatCurrency from "../scripts/utils/money.js";

class Product {
  id;
  image;
  name;
  ratings;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.ratings = productDetails.ratings;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl() {
    return `images/ratings/rating-${this.ratings.stars * 10}.png`;
  }

  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }
}

export const products = [
  {
    id: "MG-FIG-001-202300001",
    image: "images/products/product-5.png",
    name: "Denji Chainsaw Man",
    ratings: { stars: 5, count: 2980 },
    priceCents: 4999,
  },
  {
    id: "MG-FIG-002-602392074",
    image: "images/products/product-2.png",
    name: "Luffy Gear 5 One Piece",
    ratings: { stars: 5, count: 4990 },
    priceCents: 7999,
  },
  {
    id: "MG-FIG-003-001372053",
    image: "images/products/product-3.png",
    name: "Goku Ssj 1 DBZ",
    ratings: { stars: 5, count: 5300 },
    priceCents: 7999,
  },
].map((productDetails) => {
  return new Product(productDetails);
});

export function getProduct(productId) {
  const matchingProduct = products.find((product) => product.id === productId);

  return matchingProduct;
}
