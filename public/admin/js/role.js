// Phân quyền
const tablePermission = document.querySelector(".permission-table");
if (tablePermission) {
  const permissionSubmit = document.querySelector("[permission-submit]");
  permissionSubmit.addEventListener("click", async () => {
    const rowsInput = tablePermission.querySelectorAll("[data-name]");
    let arrPermission = [];
    rowsInput.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputCheck = row.querySelectorAll("input");
      if (name == "id") {
        inputCheck.forEach((input) => {
          const id = input.value;
          arrPermission.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputCheck.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            arrPermission[index].permissions.push(name);
          }
        });
      }
    });
    if (arrPermission.length > 0) {
      const res = await fetch(`/admin/roles/permission`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(arrPermission),
      });
      const data = await res.json();
      if (data.code == 200) {
        window.location.reload();
      }
    }
  });
}
// Hết Phân quyền

// Permission data default
const dataRoles = document.querySelector("[data-role]");
if (dataRoles) {
  const data = JSON.parse(dataRoles.getAttribute("data-role"));
  const tablePermission = document.querySelector(".permission-table");
  data.forEach((item, index) => {
    item.permissions.forEach((permission, indexPer) => {
      const row = tablePermission.querySelector(`[data-name="${permission}"]`);
      const input = row.querySelectorAll("input");
      input[index].checked = true;
    });
  });
}
// End Permission data default
