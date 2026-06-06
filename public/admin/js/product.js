// Thêm phiên bản
const buttonVariant = document.querySelector(".btn-variant");
const variantContainer = document.querySelector("#variant-container");

let index = 0;

if (buttonVariant) {
  buttonVariant.addEventListener("click", () => {
    const div = document.createElement("div");

    div.classList.add("variant-item");

    div.innerHTML = `
      <div class="variant-header">
        <h4>Phiên bản</h4>
        <button type="button" class="btn-remove-variant">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>

      <div class="variant-grid">
        <input
          type="text"
          name="variants[${index}][color]"
          placeholder="Màu sắc"
        >

        <input
          type="text"
          name="variants[${index}][ram]"
          placeholder="RAM"
        >

        <input
          type="text"
          name="variants[${index}][storage]"
          placeholder="Bộ nhớ"
        >

        <input
          type="number"
          name="variants[${index}][price]"
          placeholder="Giá"
        >

        <input
          type="number"
          name="variants[${index}][stock]"
          placeholder="Số lượng"
        >
      </div>
    `;

    variantContainer.appendChild(div);

    index++;
  });
  // Xoá phiên bản
  document.addEventListener("click", (e) => {
    const buttonRemove = e.target.closest(".btn-remove-variant");

    if (buttonRemove) {
      buttonRemove.closest(".variant-item").remove();
    }
  });
  // Hết Xoá phiên bản
}
// Hết thêm phiên bản
