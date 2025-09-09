// ====== Storage Helpers ======
const CART_KEY = "cart";

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Keep cart in memory
let cart = loadCart();

// ====== UI Helpers ======
function cartItemCount(cartArr) {
  return cartArr.reduce((sum, it) => sum + (it.quantity || 1), 0);
}
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cartItemCount(cart);
}
function money(v) { return "₹" + v; }

// ====== Cart Operations ======
function addToCart(product) {
  // product = {id, name, price, image?}
  const idx = cart.findIndex(p => p.id === product.id);
  if (idx > -1) {
    cart[idx].quantity = (cart[idx].quantity || 1) + 1;
  } else {
    cart.push({...product, quantity: 1});
  }
  saveCart(cart);
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function updateQuantity(index, qty) {
  const q = Math.max(1, parseInt(qty || "1", 10));
  cart[index].quantity = q;
  saveCart(cart);
  renderCart();
  updateCartCount();
}

function cartTotal() {
  return cart.reduce((sum, it) => sum + it.price * (it.quantity || 1), 0);
}

// ====== Renderers ======
function renderCart() {
  const table = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");
  if (!table || !total) return;

  table.innerHTML = "";
  cart.forEach((item, i) => {
    const line = item.price * (item.quantity || 1);
    table.innerHTML += `
      <tr>
        <td class="text-start">
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" width="80" height="60" class="rounded">
            <span>${item.name}</span>
          </div>
        </td>
        <td>${money(item.price)}</td>
        <td>
          <input type="number" min="1" value="${item.quantity || 1}" class="form-control form-control-sm text-center"
                 onchange="updateQuantity(${i}, this.value)">
        </td>
        <td>${money(line)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${i})">X</button></td>
      </tr>
    `;
  });
  total.textContent = money(cartTotal());
}

function renderCheckout() {
  const items = document.getElementById("checkout-items");
  const total = document.getElementById("checkout-total");
  if (!items || !total) return;

  items.innerHTML = "";
  cart.forEach((it) => {
    items.innerHTML += `<tr><td>${it.name} (x${it.quantity || 1})</td><td>${money(it.price * (it.quantity || 1))}</td></tr>`;
  });
  total.textContent = money(cartTotal());
}

// ====== Account (basic demo only) ======
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const pass  = document.getElementById("login-password").value;
  if (email && pass) {
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Please enter valid credentials.");
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const pass  = document.getElementById("register-password").value;
  if (name && email && pass) {
    alert("Registration successful!");
    window.location.href = "account.html";
  } else {
    alert("Please fill all fields.");
  }
}

// ====== Checkout ======
function handleCheckout(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name    = document.getElementById("billing-name").value;
  const email   = document.getElementById("billing-email").value;
  const address = document.getElementById("billing-address").value;
  const payment = document.getElementById("payment-method").value;

  if (name && email && address && payment) {
    const order = {
      customer: { name, email, address },
      items: cart,
      payment,
      date: new Date().toLocaleString()
    };
    localStorage.setItem("lastOrder", JSON.stringify(order));
    // clear cart
    cart = [];
    saveCart(cart);
    updateCartCount();
    // go to success
    window.location.href = "success.html";
  } else {
    alert("Please fill in all details.");
  }
}

// ====== Init ======
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  renderCheckout();
});
