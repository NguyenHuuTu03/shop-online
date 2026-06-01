// Swiper Image
const swiper = new Swiper(".mySwiper", {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});
const swiper2 = new Swiper(".mySwiper2", {
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  thumbs: {
    swiper: swiper,
  },
});
// End Swiper Image

// GetCookie
const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};
// End GetCookie

// button quantity
const formQuantity = document.querySelector(".quantity-wrap");
if (formQuantity) {
  const buttonDown = formQuantity.querySelector("[btn-down]");
  const buttonUp = formQuantity.querySelector("[btn-up]");
  const inputQuantity = formQuantity.querySelector(".qty-input");

  if (buttonDown && inputQuantity) {
    buttonDown.addEventListener("click", () => {
      const quantity = parseInt(inputQuantity.value);
      if (quantity > 1) {
        inputQuantity.value = quantity - 1;
      }
    });
  }
  if (buttonUp && inputQuantity) {
    buttonUp.addEventListener("click", () => {
      const quantity = parseInt(inputQuantity.value);
      inputQuantity.value = quantity + 1;
    });
  }
}
// End button quantity

// Search Suggest
const boxSearch = document.querySelector(".box-search");
if (boxSearch) {
  const inputSearch = boxSearch.querySelector(`input[name="keyword"]`);
  inputSearch.addEventListener("keyup", () => {
    const keyword = inputSearch.value.trim();
    const boxSuggest = boxSearch.querySelector(".search-suggest");
    const suggestList = boxSuggest.querySelector(".suggest-list");
    if (!keyword) {
      boxSuggest.classList.remove("active");
      suggestList.innerHTML = "";
      return;
    }

    const link = `/search/suggest?keyword=${keyword}`;
    fetch(link)
      .then((res) => res.json())
      .then((data) => {
        const products = data.products;

        if (products.length > 0) {
          boxSuggest.classList.add("active");
          const htmls = products.map((product) => {
            return `
              <a href="/products/detail/${product.slug}" class="inner-item">
                <div class="inner-image">
                  <img src="${product.thumbnail}" alt="${product.title}">
                </div>

                <div class="inner-info">
                  <div class="inner-title-suggest">
                    ${product.title}
                  </div>

                  <div class="inner-singer">
                    <i class="fa fa-tag"></i>
                    ${product.category}
                  </div>
                </div>
              </a>
            `;
          });

          suggestList.innerHTML = htmls.join("");
        } else {
          boxSuggest.classList.remove("active");
        }
      });
  });
}
// End Search Suggest

// Show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  showAlert.classList.add("show");
  const time = parseInt(showAlert.getAttribute("data-time"));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show alert

// Preview Image
const avatarInput = document.querySelector(`input[name="avatar"]`);
const avatarPreview = document.querySelector("#avatarPreview");
if (avatarInput && avatarPreview) {
  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      avatarPreview.src = imageURL;
    }
  });
}
// End Preview Image

// Show MiniCart
const showMiniCart = () => {
  const tokenUser = getCookie("tokenUser");
  const miniCart = document.querySelector("[data-mini-cart]");
  if (tokenUser) {
    fetch(`/cart/mini-cart`)
      .then((res) => res.json())
      .then((data) => {
        miniCart.innerHTML = data.quantity;
      });
  } else {
    const cart = JSON.parse(localStorage.getItem("cart"));
    countQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    miniCart.innerHTML = countQuantity;
  }
};

// End Show MiniCart

// Nếu chưa có giỏ hàng thì tạo giỏ hàng
const cart = localStorage.getItem("cart");
if (!cart) {
  localStorage.setItem("cart", JSON.stringify([]));
}
const tokenUser = getCookie("tokenUser");

if (tokenUser) {
  const cartLocal = JSON.parse(localStorage.getItem("cart"));

  if (cartLocal && cartLocal.length > 0) {
    fetch("/cart/cart-json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartLocal),
    })
      .then((res) => res.json())
      .then(() => {
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify([]));

        showMiniCart();
      });
  } else {
    showMiniCart();
  }
} else {
  showMiniCart();
}
// Button Add To Cart

const buttonAddToCart = document.querySelectorAll("[btn-cart]");
if (buttonAddToCart.length > 0) {
  buttonAddToCart.forEach((button) => {
    button.addEventListener("click", () => {
      const cart = JSON.parse(localStorage.getItem("cart"));
      const productId = button.getAttribute("btn-cart");
      const dataCart = {
        id: productId,
        quantity: 1,
      };
      const tokenUser = getCookie("tokenUser");

      // đã login
      if (tokenUser) {
        fetch(`/cart/cart-json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([dataCart]),
        })
          .then((res) => res.json())
          .then(() => {
            showMiniCart();
          });
      } else {
        const indexExits = cart.findIndex((item) => item.id == productId);
        if (indexExits == -1) {
          cart.push(dataCart);
        } else {
          cart[indexExits].quantity += 1;
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        showMiniCart();
      }
    });
  });
}
// End Button Add To Cart

// Form cart
const formCart = document.querySelector("[form-cart]");
if (formCart) {
  formCart.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputQuantity = formCart.querySelector(".qty-input");
    const buttonAdd = formCart.querySelector(".btn-cart");
    const quantity = parseInt(inputQuantity.value);
    const productId = buttonAdd.getAttribute("btn-form-cart");
    const cart = JSON.parse(localStorage.getItem("cart"));
    const dataCart = {
      id: productId,
      quantity: quantity,
    };
    const tokenUser = getCookie("tokenUser");

    if (tokenUser) {
      fetch(`/cart/cart-json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([dataCart]),
      })
        .then((res) => res.json())
        .then(() => {
          showMiniCart();
        });
    } else {
      const indexExits = cart.findIndex((item) => item.id == productId);
      if (indexExits == -1) {
        cart.push(dataCart);
      } else {
        cart[indexExits].quantity += quantity;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      showMiniCart();
    }
  });
}
// End Form cart
