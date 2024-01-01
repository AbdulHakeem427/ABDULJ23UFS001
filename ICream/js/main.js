
const shop = document.getElementById("shop");

let basket = JSON.parse(localStorage.getItem("data")) || [];
let shopItemsData = []; // This will store the data from data.json

// Fetch data from data.json
fetch('js/Data.json')
  .then(response => response.json())
  .then(data => {
    shopItemsData = data;
    generateShop();
  })
  .catch(error => console.error('Error fetching data:', error));



///////////
const filterByPrice = () => {
  const priceDropdown = document.getElementById("priceDropdown");
  const selectedPriceRange = priceDropdown.value;

  // Filter shopItemsData based on the selected price range
  const filteredItems = shopItemsData.filter(({ price }) => {
    if (selectedPriceRange === "all") {
      return true;
    } else {
      const [min, max] = selectedPriceRange.split("-").map(Number);
      return price >= min && price <= max;
    }
  });

  // Generate the shop with the filtered items
  generateShop(filteredItems);
};

const searchItems = () => {
  const searchInput = document.getElementById('searchInput').value.toLowerCase();

  // Filter shopItemsData based on the search input
  const filteredItems = shopItemsData.filter(({ name, desc }) => {
      return name.toLowerCase().includes(searchInput) || desc.toLowerCase().includes(searchInput);
  });

  // Generate the shop with the filtered items
  generateShop(filteredItems);
};


const generateShop = (items = shopItemsData) => {
  shop.innerHTML = items
      .map(({ id, name, price, desc, img }) => {
          const search = basket.find((x) => x.id === id) || [];
          return `
              <div id=product-id-${id} class="item">
                  <img width="220" src=${img} alt="">
                  <div class="details">
                      <h3>${name}</h3>
                      <p>${desc}</p>
                      <div class="price-quantity">
                          <h2>₹ ${price} </h2>
                          <div class="buttons">
                              <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                              <div id=${id} class="quantity">
                                  ${search.item === undefined ? 0 : search.item}
                              </div>
                              <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                          </div>
                      </div>
                  </div>
              </div>
          `;
      })
      .join("");
};
// Initial login state
let isLoggedIn = false;

// Toggle login/logout functionality
const toggleLogin = () => {
    if (isLoggedIn) {
        // Implement Logout functionality
        // For example, log the user out and update the UI
        isLoggedIn = false;
        document.getElementById('loginText').innerText = 'Login';
        alert('User logged out.');
    } else {
        // Implement Login functionality
        // For example, show a login modal or navigate to a login page
        isLoggedIn = true;
        document.getElementById('loginText').innerText = 'Logout';
        alert('User logged in.');
    }
};
// Call filterByPrice initially to load all items
filterByPrice();
//////////
const increment = (id) => {
  const selectedItem = id;
  const search = basket.find((x) => x.id === selectedItem.id);

  if (!search) {
    basket.push({
      id: selectedItem.id,
      item: 1,
    });
  } else {
    search.item += 1;
  }

  update(selectedItem.id);
  localStorage.setItem("data", JSON.stringify(basket));
};

const decrement = (id) => {
  const selectedItem = id;
  const search = basket.find((x) => x.id === selectedItem.id);

  if (!search) return;
  else if (search.item === 0) return;
  else {
    search.item -= 1;
  }

  update(selectedItem.id);
  basket = basket.filter((x) => x.item !== 0);
  localStorage.setItem("data", JSON.stringify(basket));
};

const update = (id) => {
  const search = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = search.item;
  calculation();
};

const calculation = () => {
  const cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

calculation();
