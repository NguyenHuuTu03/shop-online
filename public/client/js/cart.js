const updateTotalSub = () => {
  let totalPrice = 0;

  const rows = document.querySelectorAll(".cart-table__row");

  rows.forEach((row) => {
    // bỏ qua dòng đã ẩn
    if (row.classList.contains("d-none")) return;

    const subtotalElement = row.querySelector(".cart-subtotal");

    const total = parseInt(subtotalElement.getAttribute("total-price"));

    totalPrice += total;
  });

  const elementTotalPrice = document.querySelectorAll("[total-cart]");

  elementTotalPrice.forEach((element) => {
    element.innerHTML = `${totalPrice.toLocaleString("vi-VN")} đ`;
  });
};

// button delete item cart
const deleteItem = () => {
  const buttonDelete = document.querySelectorAll("[btn-delete]");

  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("btn-delete");

      const row = document.querySelector(`[data-product-id="${id}"]`);
      const quantity = parseInt(row.querySelector(".qty-input").value);

      row.classList.add("d-none");

      updateTotalSub();

      if (tokenUser) {
        fetch(`/cart/delete/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            showMiniCart();
          });
      } else {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const newCart = cart.filter((item) => item.id != id);
        localStorage.setItem("cart", JSON.stringify(newCart));
        showMiniCart();
      }
    });
  });
};

// End button delete item cart

const handleQuantity = () => {
  const formQuantity = document.querySelectorAll(".quantity-wrap");

  if (formQuantity.length > 0) {
    formQuantity.forEach((form) => {
      const buttonDown = form.querySelector("[btn-down]");
      const buttonUp = form.querySelector("[btn-up]");
      const inputQuantity = form.querySelector(".qty-input");

      const row = form.closest("tr");
      const productId = row.getAttribute("data-product-id");

      const cartPrice = row.querySelector(".cart-price");
      const cartTotal = row.querySelector(".cart-subtotal");

      const updateTotalPrice = () => {
        const quantity = parseInt(inputQuantity.value);

        const price = parseInt(cartPrice.getAttribute("price"));

        const total = quantity * price;

        cartTotal.innerHTML = `${total.toLocaleString("vi-VN")} đ`;
        cartTotal.setAttribute("total-price", total);
        updateTotalSub();
        if (tokenUser) {
          fetch(`/cart/update`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId,
              quantity,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              showMiniCart();
            });
        }
      };

      if (buttonDown) {
        buttonDown.addEventListener("click", () => {
          let quantity = parseInt(inputQuantity.value);

          if (quantity > 1) {
            quantity--;

            inputQuantity.value = quantity;

            updateTotalPrice();
            if (!tokenUser) {
              const cart = JSON.parse(localStorage.getItem("cart"));
              const indexExits = cart.findIndex((item) => item.id == productId);
              if (indexExits == -1) {
                cart.push(dataCart);
              } else {
                cart[indexExits].quantity -= 1;
              }
              localStorage.setItem("cart", JSON.stringify(cart));
              showMiniCart();
            }
          }
        });
      }

      if (buttonUp) {
        buttonUp.addEventListener("click", () => {
          let quantity = parseInt(inputQuantity.value);

          quantity++;

          inputQuantity.value = quantity;

          updateTotalPrice();
          if (!tokenUser) {
            const cart = JSON.parse(localStorage.getItem("cart"));
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
      }
    });
  }
};

//

// Lấy thông tin sản phẩm trong giỏ
// const tokenUser = getCookie("tokenUser");
const fetchApi = () => {
  const cart = JSON.parse(localStorage.getItem("cart"));
  fetch(`/cart/cart-json`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cart),
  })
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.querySelector(".cart-table__body");
      const htmls = data.cart.products.map((item) => {
        return `
        <tr class="cart-table__row" data-product-id="${item.id}">
          <td class="cart-table__td cart-table__td--image">
            <img class="cart-product__image"
                src="${item.productInfo.thumbnail}"
                alt="${item.productInfo.title}"
                width="56"
                height="56">
          </td>

          <td class="cart-table__td cart-table__td--name">
            <span class="cart-product__name">${item.productInfo.title}</span>
          </td>

          <td class="cart-table__td cart-table__td--price">
            <span class="cart-price" price="${item.productInfo.priceNew}">${item.productInfo.priceNew.toLocaleString()} đ</span>
          </td>

          <td class="cart-table__td cart-table__td--qty">
            <form class="quantity-wrap"> 
              <div class="qty-control">

                <button class="qty-control__btn qty-control__btn--decrease" 
                        btn-down
                        type="button"
                        aria-label="Giảm số lượng">
                  −
                </button>

                <input type="number" name="quantity" class="qty-control__value qty-input" value="${item.quantity}"/>

                <button class="qty-control__btn qty-control__btn--increase"
                        btn-up
                        type="button"
                        aria-label="Tăng số lượng">
                  +
                </button>

              </div>
            </form>
            
          </td>

          <td class="cart-table__td cart-table__td--subtotal">
            <span class="cart-subtotal" total-price="${item.totalPrice}">${item.totalPrice.toLocaleString()} đ</span>
          </td>

          <td class="cart-table__td cart-table__td--action">
            <button class="cart-remove-btn"
                    btn-delete="${item.id}"
                    quantity="${item.quantity}"
                    type="button"
                    aria-label="Xoá sản phẩm">
              <i class="fa-solid fa-trash"></i>

            </button>
          </td>
        </tr>
      `;
      });
      if (tableBody) {
        tableBody.innerHTML = htmls.join("");
        handleQuantity();
        deleteItem();
        updateTotalSub();
      }
      showMiniCart();
    });
};

if (tokenUser) {
  fetchApi();
  localStorage.removeItem("cart");
} else {
  fetchApi();
}

// Hết Lấy thông tin sản phẩm trong giỏ
