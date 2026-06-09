const products = [
  {
    id: 1,
    name: "Полуниця в молочному шоколаді",
    price: 890,
    img: "https://i.pinimg.com/736x/a6/57/77/a657772cb1944457c8e0527193dd53ac.jpg",
    weight: "250г"
  },
  {
    id: 2,
    name: "Полуниця в білому шоколаді",
    price: 920,
    img: "https://i.pinimg.com/736x/d7/da/4e/d7da4effc4646e8fb72e7634b587088b.jpg",
    weight: "250г"
  },
  {
    id: 3,
    name: "Полуниця в темному шоколаді",
    price: 950,
    img: "https://i.pinimg.com/1200x/9e/4e/ea/9e4eea09364808283b2c691dc76302b3.jpg",
    weight: "250г"
  },
  {
    id: 4,
    name: "Ягідний мікс Premium",
    price: 1250,
    img: "https://i.pinimg.com/1200x/74/b1/a7/74b1a7d77bfab2340a81e5958ce6fd4d.jpg",
    weight: "300г"
  },
  {
    id: 5,
    name: "Luxury Box",
    price: 1490,
    img: "https://i.pinimg.com/736x/19/24/1b/19241ba8116ce9957a19b2f85ee85fd0.jpg",
    weight: "350г"
  },
  {
    id: 6,
    name: "Цукерки лохина/малина в шоколаді",
    price: 1750,
    img: "https://i.pinimg.com/736x/2c/bf/55/2cbf55f89557150133c6b8cb09a8ead6.jpg",
    weight: "400г"
  },
  {
    id: 7,
    name: "Подарункова коробка",
    price: 1190,
    img: "https://i.pinimg.com/736x/27/2a/3c/272a3cd0645ebd3e38cf901efbd2387a.jpg",
    weight: "280г"
  },
  {
    id: 8,
    name: "Фруктовий букет",
    price: 1890,
    img: "https://i.pinimg.com/736x/38/63/70/38637085818fa6394accb540f599d58e.jpg",
    weight: "450г"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderProducts(list = products) {
  const container = document.getElementById("products");

  container.innerHTML = list.map(product => `
    <div class="product-card">
      <img src="${product.img}" alt="${product.name}">
      <div class="p-6">
        <h3 class="text-xl font-semibold mb-2">
          ${product.name}
        </h3>
        <p class="text-gray-500 mb-4">
          ${product.weight}
        </p>
        <div class="flex justify-between items-center mb-4">
          <span class="text-2xl font-bold text-[#8b5a2b]">
            ${product.price} грн
          </span>
        </div>
        <div class="flex gap-2 items-center">
          <div class="flex items-center border-2 border-[#8b5a2b] rounded-lg bg-white">
            <button
              onclick="decrementQty(${product.id})"
              class="px-4 py-2 text-[#8b5a2b] font-bold text-lg hover:bg-[#f8f5f2] transition">
              −
            </button>
            <span id="qty-${product.id}" class="px-4 py-2 min-w-[50px] text-center font-bold text-lg border-l border-r border-[#8b5a2b]">1</span>
            <button
              onclick="incrementQty(${product.id})"
              class="px-4 py-2 text-[#8b5a2b] font-bold text-lg hover:bg-[#f8f5f2] transition">
              +
            </button>
          </div>
          <button
            onclick="addToCartWithQty(${product.id})"
            class="flex-1 bg-[#8b5a2b] text-white px-4 py-2 rounded-lg hover:bg-[#6d4410] transition font-semibold">
            В кошик
          </button>
        </div>
      </div>
    </div>
  `).join("");
}

let productQuantities = {};

function incrementQty(id) {
  if (!productQuantities[id]) productQuantities[id] = 1;
  productQuantities[id]++;
  document.getElementById(`qty-${id}`).textContent = productQuantities[id];
}

function decrementQty(id) {
  if (!productQuantities[id]) productQuantities[id] = 1;
  if (productQuantities[id] > 1) {
    productQuantities[id]--;
    document.getElementById(`qty-${id}`).textContent = productQuantities[id];
  }
}

function addToCartWithQty(id) {
  const quantity = productQuantities[id] || 1;
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity: quantity
    });
  }

  saveCart();
  showToast(product.name, quantity);
  productQuantities[id] = 1;
  document.getElementById(`qty-${id}`).textContent = 1;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  showToast(product.name);
}

function showToast(name, qty = 1) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 right-6 bg-[#8b5a2b] text-white px-6 py-4 rounded-2xl shadow-xl z-50";
  toast.textContent = `${name} (${qty} шт.) додано в кошик`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

function updateCartCount() {
  const count = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  document.getElementById("cart-count").textContent = count;
}

function toggleCart() {
  const modal = document.getElementById("cart-modal");
  modal.classList.toggle("hidden");
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">Кошик порожній</p>';
    document.getElementById("cart-total").textContent = "0 грн";
    return;
  }

  container.innerHTML = cart.map((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="border-b pb-6 mb-6 last:border-b-0">
        <div class="flex gap-4 mb-4">
          <img
            src="${item.img}"
            class="w-24 h-24 object-cover rounded-lg">
          <div class="flex-1">
            <h4 class="font-semibold text-lg mb-1">
              ${item.name}
            </h4>
            <p class="text-gray-600 mb-3">
              ${item.weight}
            </p>
            <p class="text-lg font-bold text-[#8b5a2b]">
              ${item.price} грн × ${item.quantity} = <span class="text-red-600">${itemTotal} грн</span>
            </p>
          </div>
          <button
            onclick="removeFromCart(${index})"
            class="text-red-500 text-2xl hover:text-red-700 hover:scale-125 transition">
            ✕
          </button>
        </div>
        
        <div class="flex gap-3 items-center justify-between">
          <span class="text-sm text-gray-600">Кількість:</span>
          <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onclick="decrementCartItem(${index})"
              class="w-10 h-10 flex items-center justify-center bg-[#8b5a2b] text-white font-bold rounded hover:bg-[#6d4410] transition">
              −
            </button>
            <span class="w-12 h-10 flex items-center justify-center font-bold text-lg bg-white rounded border border-[#8b5a2b]">
              ${item.quantity}
            </span>
            <button
              onclick="incrementCartItem(${index})"
              class="w-10 h-10 flex items-center justify-center bg-[#8b5a2b] text-white font-bold rounded hover:bg-[#6d4410] transition">
              +
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("cart-total").textContent = total + " грн";
}

function incrementCartItem(index) {
  cart[index].quantity++;
  saveCart();
  renderCart();
}

function decrementCartItem(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function checkout() {
  if (cart.length === 0) {
    alert("Кошик порожній");
    return;
  }

  alert("Дякуємо за замовлення ❤️");
  cart = [];
  saveCart();
  renderCart();
  toggleCart();
}

function sortProducts() {
  const type = document.getElementById("sort").value;
  let sorted = [...products];

  if (type === "price-low") {
    sorted.sort((a, b) => a.price - b.price);
  }

  if (type === "price-high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  renderProducts(sorted);
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();

  const search = document.getElementById("search");

  search.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value)
    );
    renderProducts(filtered);
  });
});
