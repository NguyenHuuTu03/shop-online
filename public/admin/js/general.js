// General Submit
const generalSubmit = document.querySelector("[general-submit]");
if (generalSubmit) {
  generalSubmit.addEventListener("click", () => {
    const formGeneral = document.querySelector(".general-setting__form");
    if (formGeneral) {
      formGeneral.submit();
    }
  });
}
// End General Submit
