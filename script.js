let selectedProductName = '';
let productsData = [];

const productList = document.getElementById('product-list');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const filterConfirmBtn = document.getElementById('filterConfirmBtn');
const adBanner = document.getElementById('adBanner');

// Load products
fetch('products.json')
  .then(res => res.json())
  .then(products => {
    productsData = products;
    displayProducts(productsData);
  });

// Display products
function displayProducts(products) {
  productList.innerHTML = '';
  if (products.length === 0) {
    productList.innerHTML = '<p>No products found.</p>';
    return;
  }
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Price: NPR ${product.price}</p>
      <p>${product.description}</p>
      <button data-product="${product.name}">Order Now</button>
    `;
    card.querySelector('button').addEventListener('click', () => openOrderForm(product.name));
    productList.appendChild(card);
  });
}

// Open/Close modal
function openOrderForm(productName) {
  selectedProductName = productName;
  document.getElementById('selectedProduct').textContent = "Product: " + productName;
  document.getElementById('orderForm').style.display = 'flex';
}

document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('orderForm').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

function closeModal() {
  document.getElementById('orderForm').style.display = 'none';
  document.getElementById('addressForm').reset();
}

// Build order message
function buildMessage() {
  const quantity = document.getElementById('quantity').value;
  const FullName= document.getElementById('Name').value;
  const ContactNumber = document.getElementById('ContactNumber').value;
  const province = document.getElementById('province').value;
  const district = document.getElementById('district').value;
  const municipality = document.getElementById('municipality').value;
  const ward = document.getElementById('ward').value;
  const nearby = document.getElementById('nearby').value;

  return `Hello Charmly Gift, I want to order:

Item: ${selectedProductName}
Quantity: ${quantity}

Full Name: ${FullName}
Contact Number: ${ContactNumber}
Province: ${province}
District: ${district}
Municipality: ${municipality}
Ward No: ${ward}
Nearby: ${nearby}

Please confirm availability.`;
}

// WhatsApp
document.getElementById('whatsappBtn').addEventListener('click', () => {
  const message = buildMessage();
  const phoneNumber = "9779812595676"; 
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  closeModal();
});

// Ads
const ads = [
  { image: 'images/ad1.jpg', link: 'https://ad1.com' },
  { image: 'images/ad2.jpg', link: 'https://ad2.com' },
  { image: 'images/ad3.jpg', link: 'https://ad3.com' }
];

let currentAd = 0;

function showAd() {
  adBanner.innerHTML = `<a href="${ads[currentAd].link}" target="_blank">
                          <img src="${ads[currentAd].image}" class="show" alt="Ad Banner">
                        </a>`;
  currentAd = (currentAd + 1) % ads.length;
}

// Preload ad images
ads.forEach(ad => new Image().src = ad.image);

showAd();
setInterval(showAd, 5000);

// Filter & search
filterConfirmBtn.addEventListener('click', () => {
  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const filtered = productsData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  displayProducts(filtered);
});
