const storeWhatsApp = "917479257078"; // ← Replace with your WhatsApp number
let ShoppingCart = document.getElementById("shopping-cart");
let label = document.getElementById("label");

// 🧺 Retrieve basket data from localStorage
let basket = JSON.parse(localStorage.getItem("data")) || [];

// 🧮 Update cart icon with total items
let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};
calculation();

// 🛍️ Generate Cart Items
let generateCartItems = () => {
  if (basket.length !== 0) {
    return (ShoppingCart.innerHTML = basket
      .map((x) => {
        let { id, item } = x;
        let search = shopItemsData.find((x) => x.id === id) || [];
        let { img, price, name } = search;
        return `
      <div class="cart-item">
        <img width="100" src=${img} alt="" />

        <div class="details">
          <div class="title-price-x">
            <h4 class="title-price">
              <p>${name}</p>
              <p class="cart-item-price">₹ ${price}</p>
            </h4>
            <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
          </div>

          <div class="cart-buttons">
            <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
            </div>
          </div>

          <h3>₹ ${item * price}</h3>
        </div>
      </div>
      `;
      })
      .join(""));
  } else {
    ShoppingCart.innerHTML = "";
    label.innerHTML = `
    <h2>🛒 Cart is Empty</h2>
    <a href="index.html">
      <button class="HomeBtn">Back to Home</button>
    </a>
    `;
  }
};

generateCartItems();

// ➕ Increase Quantity
let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({ id: selectedItem.id, item: 1 });
  } else {
    search.item += 1;
  }

  generateCartItems();
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};

// ➖ Decrease Quantity
let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else search.item -= 1;

  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  generateCartItems();
  localStorage.setItem("data", JSON.stringify(basket));
};

// 🔁 Update Item Count
let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
  TotalAmount();
};

// ❌ Remove Single Item
let removeItem = (id) => {
  let selectedItem = id;
  basket = basket.filter((x) => x.id !== selectedItem.id);
  calculation();
  generateCartItems();
  TotalAmount();
  localStorage.setItem("data", JSON.stringify(basket));
};

// 💰 Total Amount Calculation
let TotalAmount = () => {
  if (basket.length !== 0) {
    let amount = basket
      .map((x) => {
        let { id, item } = x;
        let filterData = shopItemsData.find((x) => x.id === id);
        return filterData.price * item;
      })
      .reduce((x, y) => x + y, 0);

    return (label.innerHTML = `
    <h2>Total Bill : ₹ ${amount}</h2>
    <button onclick="checkoutOrder()" class="checkout">Confirm Order</button>
    <button onclick="clearCart()" class="removeAll">Clear Cart</button>
    `);
  }
};

TotalAmount();

// 🧹 Clear Entire Cart
let clearCart = () => {
  basket = [];
  generateCartItems();
  calculation();
  localStorage.setItem("data", JSON.stringify(basket));
};

// 🔔 Custom Notification
function showNotification(message, color = "#077b32") {
  const notification = document.getElementById("notification");
  const text = document.getElementById("notification-text");

  text.textContent = message;
  notification.style.backgroundColor = color;
  notification.classList.remove("hidden");
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
    notification.classList.add("hidden");
  }, 3000);
}

// ✅ Checkout Order via WhatsApp
function checkoutOrder() {
  if (basket.length === 0) {
    showNotification("⚠️ Your cart is empty!", "#e63946");
    return;
  }

  // Build order details
  let orderText = "🛒 My Order:\n\n";
  let totalAmount = 0;

  basket.forEach((x, index) => {
    let { id, item } = x;
    let product = shopItemsData.find(p => p.id === id) || {};
    let price = product.price || 0;
    let mrp = product.mrp || price;
    let name = product.name || "Item";

    let discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
    let itemTotal = item * price;
    totalAmount += itemTotal;

    orderText += `${index + 1}. ${name}\n   Qty: ${item}\n   Price: ₹${price}  ${mrp > price ? `(M.R.P: ₹${mrp}, ${discount}% off)` : ""}\n   Total: ₹${itemTotal}\n\n`;
  });

  orderText += `💰 Total Amount: ₹${totalAmount}`;

  // Minimum order check
  if (totalAmount < 5000) {
    showNotification("⚠️ You have to order minimum ₹5000.", "#e63946");
    orderText = `Hello! My order is below ₹5000. Please suggest more items.\n\n` + orderText;
  } else {
    orderText = `Hello! I want to confirm my order:\n\n` + orderText;
    showNotification("✅ Thank you for shopping with us!");
  }

  // Encode text for WhatsApp link
  const encodedText = encodeURIComponent(orderText);

  // Open WhatsApp
  window.open(`https://wa.me/${storeWhatsApp}?text=${encodedText}`, "_blank");
}
