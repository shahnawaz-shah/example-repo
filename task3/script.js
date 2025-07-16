let cartItems = [];

//add to cart button funtionality for Designer Cap
document.querySelector("#add-to-cart1").addEventListener("click", function (e) {
  let capPrice = document.querySelector("#item1-price").innerHTML;
  let capName = document.querySelector("#item1-name").innerHTML;

  let existingItem = cartItems.find((item) => item.itemName === capName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ itemName: capName, itemPrice: capPrice, quantity: 1 });
  }
  console.table(cartItems);
  updateCart();
});

//add to cart button funtionality for Jacket
document.querySelector("#add-to-cart2").addEventListener("click", function (e) {
  let jacketPrice = document.querySelector("#item2-price").innerHTML;
  let jacketName = document.querySelector("#item2-name").innerHTML;

  let existingItem = cartItems.find((item) => item.itemName === jacketName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      itemName: jacketName,
      itemPrice: jacketPrice,
      quantity: 1,
    });
  }
  console.table(cartItems);
  updateCart();
});

//add to cart button funtionality for Shirt
document.querySelector("#add-to-cart3").addEventListener("click", function (e) {
  let shirtPrice = document.querySelector("#item3-price").innerHTML;
  let shirtName = document.querySelector("#item3-name").innerHTML;

  let existingItem = cartItems.find((item) => item.itemName === shirtName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ itemName: shirtName, itemPrice: shirtPrice, quantity: 1 });
  }
  console.table(cartItems);
  updateCart();
});

//function to update cart with clicked items
function updateCart() {
  let cart = document.querySelector("#cart-list");
  cart.innerHTML = "";

  for (let i = 0; i < cartItems.length; i++) {
    let li = document.createElement("li");

    li.textContent = `Item: ${cartItems[i].itemName} | Cost: £${(
      cartItems[i].itemPrice * cartItems[i].quantity
    ).toFixed(2)} | Quantity: ${cartItems[i].quantity} `;

    let removeOneButton = document.createElement("button");
    removeOneButton.textContent = "-";
    removeOneButton.classList.add("remove-one");
    removeOneButton.setAttribute("data-name", cartItems[i].itemName);

    li.appendChild(removeOneButton);
    cart.appendChild(li);
  }

  let totalPrice = cartItems.reduce((runningTotal, currentItem) => {
    return runningTotal + Number(currentItem.itemPrice * currentItem.quantity);
  }, 0);

  //format total into GBP currency
  let formattedTotal = totalPrice.toLocaleString(`en-GB`, {
    style: `currency`,
    currency: `GBP`,
  });
  document.getElementById("total").textContent =
    "Cart Total = " + formattedTotal;
  console.log("Total price:", formattedTotal);

  localStorage.setItem("cart", JSON.stringify(cartItems));
}

// clear cart button. v2 - added in localStorage and cookies removal
document.querySelector("#clear").addEventListener("click", function (e) {
  cartItems = [];
  localStorage.removeItem("cart");

  document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
  document.cookie = "shipping=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

  updateCart();
});

// remove one button in cart
document.querySelector("#cart-list").addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-one")) {
    let itemName = e.target.getAttribute("data-name");
    console.log("Removing one from:", itemName);

    let item = cartItems.find((product) => product.itemName === itemName);

    if (item) {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        cartItems = cartItems.filter((i) => i.itemName !== itemName);
      }
      updateCart();
    }
  }
});

//implementing localStorage for cart
const storedCart = localStorage.getItem("cart");
if (storedCart) {
  cartItems = JSON.parse(storedCart);
  updateCart();
}

//changing font based on drop-down selection + sessionStorage
let select = document.querySelector("#form-select");

if (sessionStorage.getItem("autosave")) {
  select.value = sessionStorage.getItem("autosave");
  document.body.style.fontFamily = select.value;
}

select.addEventListener("change", () => {
  console.log(`The font changed to: ${select.value}`);

  let selectedFont = select.value;
  document.body.style.fontFamily = selectedFont;

  sessionStorage.setItem("autosave", selectedFont);
});

//registering a service worker (for cache)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      console.log("Service worker registration succeeded:", registration);
    });
}

//cookie banner function
function acceptCookies() {
  document.cookie =
    "consent=true; expires=Fri, 26 Dec 2025 23:59:59 GMT; path=/";
  document.getElementById("cookie-consent").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  if (!document.cookie.includes("consent=true")) {
    document.getElementById("cookie-consent").style.display = "block";
  }
});

//svaing username input to a cookie
function saveUsername() {
  let username = document.getElementById("input-field").value;
  console.log(username);

  document.cookie =
    "username=" + username + "; expires=Fri, 26 Dec 2025 23:59:59 GMT; path=/";
}

//retrieving the username from the cookie & displaying it in DOM
document.addEventListener("DOMContentLoaded", () => {
  if (document.cookie.includes("username")) {
    let cookieArray = document.cookie.split(";");
    let username;
    for (let i = 0; i < cookieArray.length; i++) {
      let trimmedCookie = cookieArray[i].trim();

      if (trimmedCookie.includes("username")) {
        let usernameKeyValue = trimmedCookie.split("=");
        username = usernameKeyValue[1];
        break;
      }
    }
    let greetingHeader = document.getElementById("greetingHeading");
    greetingHeader.textContent = "Welcome back " + username + "!";
    document.getElementById("input-field").style.display = "none";
    document.getElementById("username-submit").style.display = "none";
  }
});

//quick cookie check
console.log("");
console.log("This is what's in the cookies: " + document.cookie);
console.log("");

// keeping preferred delivery method in cookies and retaining in drop-down
let shippingSelect = document.querySelector("#shipping-select");

shippingSelect.addEventListener("change", () => {
  document.cookie =
    "shipping=" +
    shippingSelect.value +
    "; expires=Fri, 26 Dec 2025 23:59:59 GMT; path=/";
});

document.addEventListener("DOMContentLoaded", () => {
  if (document.cookie.includes("shipping=")) {
    let shippingCookieArray = document.cookie.split(";");
    let savedShipping;
    for (let i = 0; i < shippingCookieArray.length; i++) {
      let trimmedShippingCookie = shippingCookieArray[i].trim();

      if (trimmedShippingCookie.includes("shipping")) {
        let shippingKeyValue = trimmedShippingCookie.split("=");
        savedShipping = shippingKeyValue[1];
        break;
      }
    }
    shippingSelect.value = savedShipping;
  }
});
