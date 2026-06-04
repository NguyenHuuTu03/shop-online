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
      previewThumbnail.style.display = "block";
    }
  });
}
// End Preview 1 Image

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
