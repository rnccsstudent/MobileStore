let shop = document.getElementById("shop");
let currentData = [...shopItemsData]; // store the current data (filtered/sorted)


/**
 * ! Basket to hold all the selected items
 * ? the getItem part is retrieving data from the local storage
 * ? if local storage is blank, basket becomes an empty array
 */

let basket = JSON.parse(localStorage.getItem("data")) || [];

/**
 * ! Generates the shop with product cards composed of
 * ! images, title, price, buttons, description
 */
let itemsPerPage = 8; // how many items to show each time
let currentIndex = 0; // starting index




// let generateShop = (filteredData = currentData, reset = false) => {
//   const loadMoreBtn = document.getElementById("loadMoreBtn");

//   if (reset) {
//     currentIndex = 0;
//     shop.innerHTML = ""; // clear previous items
//   }

//   const itemsToShow = filteredData.slice(currentIndex, currentIndex + itemsPerPage);

//   // append items
//   shop.innerHTML += itemsToShow
//     .map((x) => {
//       let { id, name, desc, img, price } = x;
//       let search = basket.find((y) => y.id === id) || [];
//       return `
//         <div id=product-id-${id} class="item">
//           <img width="220" loading="lazy" src=${img} alt="">
//           <div class="details">
//             <h3>${name}</h3>
//             <p>${desc}</p>
//             <div class="price-quantity">
//               <h2>₹ ${price}</h2>
//               <div class="buttons">
//                 <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
//                 <div id=${id} class="quantity">${search.item === undefined ? 0 : search.item}</div>
//                 <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
//               </div>
//             </div>
//           </div>
//         </div>`;
//     })
//     .join("");

//   currentIndex += itemsPerPage;

//   // ✅ Show/hide Load More correctly
//   if (currentIndex >= filteredData.length) {
//     loadMoreBtn.style.display = "none"; // hide when all items shown
//   } else {
//     loadMoreBtn.style.display = "block"; // show if more items left
//   }
// };

let generateShop = (filteredData = currentData, reset = false) => {
  if (reset) {
    currentIndex = 0;
    shop.innerHTML = "";
  }

  const itemsToShow = filteredData.slice(currentIndex, currentIndex + itemsPerPage);

  shop.innerHTML += itemsToShow
  .map((x) => {
    let { id, name, img, price, mrp, desc } = x;
    let search = basket.find((y) => y.id === id) || [];
    let discount = Math.round(((mrp - price) / mrp) * 100);

    return `
      <div id=product-id-${id} class="item">
        <img width="220" loading="lazy" src=${img} alt="">
        <div class="details">
          <h3>${name}</h3>
          <p class="desc">${desc}</p> <!-- Added description here -->
          <div class="price-quantity">
            <h2>
              ₹ ${price}
              <span class="mrp"><s>₹ ${mrp}</s> (${discount}% off)</span>
            </h2>
            <div class="buttons">
              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
              <div id=${id} class="quantity">${search.item === undefined ? 0 : search.item}</div>
              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
            </div>
          </div>
        </div>
      </div>`;
  })
  .join("");

  currentIndex += itemsPerPage;

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  loadMoreBtn.style.display = currentIndex >= filteredData.length ? "none" : "block";
};



function loadMore() {
  generateShop(currentData); // always use currentData (sorted or filtered)
}


// initial load
generateShop(shopItemsData, true);

// 🔍 Search Function
function searchItem() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  if (input.trim() === "") {
    currentData = [...shopItemsData]; // reset to all items
    generateShop(currentData, true);
    loadMoreBtn.style.display = "block";
    return;
  }

  const filteredItems = shopItemsData.filter(
    (item) =>
      item.name.toLowerCase().includes(input) ||
      item.desc.toLowerCase().includes(input)
  );

  currentData = filteredItems; // update currentData for consistency

  if (filteredItems.length === 0) {
    shop.innerHTML = `<h3 style="text-align:center; color:red;">❌ Item not available in store</h3>`;
    loadMoreBtn.style.display = "none";
  } else {
    generateShop(filteredItems, true);
    loadMoreBtn.style.display = filteredItems.length > itemsPerPage ? "block" : "none";
  }
}


// Optional: live search while typing
document.getElementById("searchInput").addEventListener("keyup", searchItem);

/**
 * ! used to increase the selected product item quantity by 1
 */

let increment = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  console.log(basket);
  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! used to decrease the selected product item quantity by 1
 */

let decrement = (id) => {
  let selectedItem = id;
  let search = basket.find((x) => x.id === selectedItem.id);

  if (search === undefined) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  console.log(basket);
  localStorage.setItem("data", JSON.stringify(basket));
};

/**
 * ! To update the digits of picked items on each item card
 */

let update = (id) => {
  let search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
};

/**
 * ! To calculate total amount of selected Items
 */

let calculation = () => {
  let cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();

function sortItems() {
  const sortOption = document.getElementById("sortPrice").value;
  currentData = [...shopItemsData]; // clone original array

  if (sortOption === "lowToHigh") {
    currentData.sort((a, b) => a.price - b.price);
  } else if (sortOption === "highToLow") {
    currentData.sort((a, b) => b.price - a.price);
  }

  currentIndex = 0; // reset index
  generateShop(currentData, true);
}


