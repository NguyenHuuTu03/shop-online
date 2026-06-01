fetch(`/order/order-json`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: cart,
})
  .then((res) => res.json())
  .then((data) => {
    const orderProducts = document.querySelector(".order-products");
    if (orderProducts) {
      const htmls = data.dataCart.products.map((item) => {
        return `
          <div class="product-item">
            <div class="product-item__info">
              <h6 class="mb-1">${item.productInfo.title}</h6>
              <span class="text-muted">x${item.quantity}</span>
            </div>

            <div class="product-item__price">
              ${Math.round(
                item.productInfo.price * (1 - item.productInfo.discount / 100),
              ).toLocaleString()}đ
            </div>
          </div>
          `;
      });
      orderProducts.innerHTML = htmls.join("");

      const elementSummaryTotal = document.querySelector(".totalPrice");
      if (elementSummaryTotal) {
        elementSummaryTotal.innerHTML = `${data.dataCart.totalPrice.toLocaleString()} đ`;
      }
    }
  });

// Hết Đặt hàng

// Huỷ đơn hàng
const buttonDeleteOrder = document.querySelectorAll("[btn-del-order]");
if (buttonDeleteOrder.length > 0) {
  buttonDeleteOrder.forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.getAttribute("btn-del-order");
      const res = await fetch(`/order/delete/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "CANCELED",
        }),
      });
      const data = await res.json();
      if (data.code == 200) {
        // close modal
        const cancelModal = document.querySelector("#cancelModal");

        const modal = bootstrap.Modal.getInstance(cancelModal);
        modal.hide();
        // End close modal

        const elementOrderStatus = document.querySelector(
          `[cancel-order="cancel-${id}"]`,
        );
        elementOrderStatus.innerHTML = "Đã huỷ";
      }
    });
  });
}
// Hết Huỷ đơn hàng

// Đặt hàng
const formOrder = document.querySelector("#checkoutForm");
if (formOrder) {
  formOrder.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(e.target.elements.fullName);
    const formData = {
      fullName: e.target.elements.fullName.value,
      phone: e.target.elements.phone.value,
      email: e.target.elements.email.value,
      address: e.target.elements.address.value,
      paymentMethod: e.target.elements.paymentMethod.value,
    };
    const res = await fetch("/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (formData.paymentMethod === "MoMo") {
      const momoRes = await fetch("/payment/momo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.orderId,
          totalPrice: data.amount,
        }),
      });

      const momoData = await momoRes.json();

      console.log(momoData);

      // redirect sang MoMo
      if (momoData.data.payUrl) window.location.href = momoData.data.payUrl;
      return;
    }
    if (formData.paymentMethod === "VNPay") {
      const res = await fetch("/payment/vnpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: data.orderId,
          amount: data.amount,
        }),
      });

      const result = await res.json();

      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
      return;
    }

    // ================= COD =================
    window.location.href = `/order/success/${data.orderId}`;
  });
}
