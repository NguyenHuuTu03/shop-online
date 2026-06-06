// Tìm kiếm
const formSearch = document.querySelector(".search-box");
if (formSearch) {
  let url = new URL(window.location.href);
  const inputSearch = formSearch.querySelector(`input[name="keyword"]`);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
  const key = url.searchParams.get("keyword");
  inputSearch.value = key;
}
// Hết Tìm kiếm

// Bộ lọc
const formFilter = document.querySelector(".form-filter");
if (formFilter) {
  let url = new URL(window.location.href);
  formFilter.addEventListener("change", (e) => {
    console.log(e.target.value.split("-"));
    const [sortKey, sortValue] = e.target.value.split("-");
    if (sortKey != "all" && sortValue != "all") {
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
    } else {
      url.searchParams.delete("sortKey");
      url.searchParams.delete("sortValue");
    }
    window.location.href = url.href;
  });
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    formFilter.value = `${sortKey}-${sortValue}`;
  } else {
    formFilter.value = "all-all";
  }
}

const formFilterLimit = document.querySelector(".form-filter-limit");
if (formFilterLimit) {
  let url = new URL(window.location.href);
  formFilterLimit.addEventListener("change", (e) => {
    const limit = e.target.value;
    if (limit) {
      url.searchParams.set("limit", limit);
    }
    window.location.href = url.href;
  });
  const limit = url.searchParams.get("limit");
  if (limit) {
    formFilterLimit.value = limit;
  }
}
// Hết Bộ lọc

// CheckBox
const formTable = document.querySelector(".product-table");

if (formTable) {
  const checkAll = formTable.querySelector("[check-all]");
  const checkItems = formTable.querySelectorAll("[check-item]");

  checkAll.addEventListener("change", () => {
    checkItems.forEach((checkbox) => {
      checkbox.checked = checkAll.checked;
    });
  });

  checkItems.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const countChecked = formTable.querySelectorAll(
        "[check-item]:checked",
      ).length;

      checkAll.checked = countChecked === checkItems.length;
    });
  });
}
// End CheckBox

// Pagination
const buttonPages = document.querySelectorAll("[btn-page]");
if (buttonPages.length > 0) {
  let url = new URL(window.location.href);
  buttonPages.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("btn-page");
      if (page) {
        url.searchParams.set("page", page);
      }
      window.location.href = url.href;
    });
  });
}
const buttonPre = document.querySelector("[btn-pre]");
if (buttonPre) {
  let url = new URL(window.location.href);
  let currentPage = parseInt(url.searchParams.get("page"));
  if (currentPage) {
    buttonPre.addEventListener("click", () => {
      url.searchParams.set("page", currentPage - 1);
      window.location.href = url.href;
    });
  }
}

const buttonNex = document.querySelector("[btn-nex]");
if (buttonNex) {
  let url = new URL(window.location.href);
  const currentPage = parseInt(url.searchParams.get("page"));
  if (currentPage) {
    buttonNex.addEventListener("click", () => {
      url.searchParams.set("page", currentPage + 1);
      window.location.href = url.href;
    });
  }
}
// End Pagination

// Preview 1 Image
const inputThumb = document.querySelector("[btn-thumb]");
const previewThumbnail = document.querySelector("#thumbnailPreview");
if (inputThumb) {
  inputThumb.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      previewThumbnail.src = URL.createObjectURL(file);
      // if (previewThumbnail.classList.contains("d-none")) {
      //   previewThumbnail.classList.remove("d-none");
      // }
      previewThumbnail.style.display = "block";
    }
  });
}
// End Preview 1 Image

// Preview nhiều Image
const inputImage = document.querySelector("[btn-image]");
const previewImage = document.querySelector("#imagesPreview");
if (inputImage) {
  inputImage.addEventListener("change", (e) => {
    previewImage.innerHTML = "";
    for (const file of e.target.files) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.classList.add("preview-img");

      previewImage.appendChild(img);
    }
  });
}
// Preview nhiều Image

// Delete item
const formDelete = document.querySelector("[form-delete]");

if (formDelete) {
  const buttonDeletes = document.querySelectorAll("[del-item]");

  buttonDeletes.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("del-item");
      const action = formDelete.action;
      formDelete.action = action + `${id}?_method=PATCH`;
      formDelete.submit();
    });
  });
}

// End Delete item

// Change status
const btnStatus = document.querySelectorAll("[btn-status]");
if (btnStatus.length > 0) {
  btnStatus.forEach((button) => {
    button.addEventListener("click", async () => {
      let status = button.getAttribute("btn-status");
      const id = button.getAttribute("btn-id");
      const page = button.getAttribute("page");
      if (status == "active") {
        status = "inactive";
      } else {
        status = "active";
      }
      const res = await fetch(`/admin/api/change-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          status: status,
          page: page,
        }),
      });
      const data = await res.json();
      if (data.code == 200) {
        window.location.reload();
      }
    });
  });
}
// End Change status

// Cập nhật trạng thái thanh toán
const btnPaymentStatus = document.querySelectorAll("[btn-payment]");
if (btnPaymentStatus.length > 0) {
  btnPaymentStatus.forEach((button) => {
    button.addEventListener("click", async () => {
      let statusPayment = button.getAttribute("btn-payment");
      if (statusPayment == "UNPAID") {
        statusPayment = "PAID";
      } else if (statusPayment == "PAID") {
        statusPayment = "UNPAID";
      }
      const orderId = button.getAttribute("btn-data-order");
      const res = await fetch(`/admin/deliver/change-payment-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          paymentStatus: statusPayment,
        }),
      });
      const data = await res.json();
      if (data.code == 200) {
        if (data.orderStatus == "COMPLETED") {
          window.location.reload();
        }
      }
    });
  });
}
// Hết Cập nhật trạng thái thanh toán

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
          fetch(`/admin/orders/update/${id}`, {
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
