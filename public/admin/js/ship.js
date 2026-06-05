// Nhận đơn
const btnAddShip = document.querySelectorAll("[btn-add-ship]");
if (btnAddShip.length > 0) {
  btnAddShip.forEach((button) => {
    button.addEventListener("click", async () => {
      const orderId = button.getAttribute("btn-add-ship");
      const res = await fetch(`/admin/deliver/ship`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
        }),
      });

      const data = await res.json();
      if (data.code == 200) {
        const elementOrder = document.querySelector(`[data-order="${orderId}"`);
        elementOrder.classList.add("d-none");
      }
    });
  });
}
// Hết Nhận đơn
