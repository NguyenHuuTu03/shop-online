// Cập nhật trạng thái đơn hàng
const listStatus = [
  {
    status: "PENDING",
    label: "Chờ xác nhận",
  },
  {
    status: "CONFIRMED",
    label: "Đã xác nhận",
  },
  {
    status: "SHIPPING",
    label: "Đang giao",
  },
  {
    status: "COMPLETED",
    label: "Đã giao",
  },
];
const buttonStatusOrder = document.querySelectorAll("[btn-status-order]");
if (buttonStatusOrder.length > 0) {
  buttonStatusOrder.forEach((button) => {
    button.addEventListener("click", () => {
      const orderStatus = button.getAttribute("btn-status-order");
      if (orderStatus == "CANCELED" || orderStatus == "COMPLETED") {
        return;
      } else {
        const index = listStatus.findIndex(
          (item) => item.status == orderStatus,
        );
        if (index === -1 || index === listStatus.length - 1) return;
        if (index != -1) {
          const newStatus = listStatus[index + 1].status;
          const id = button.getAttribute("data-order");
          fetch(`/admin/orders/edit/status/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: id,
              status: newStatus,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.code == 200) {
                window.location.reload();
              }
            });
        }
      }
    });
  });
}
// Hết Cập nhật trạng thái đơn hàng
