const banner = new Swiper(".hero-banner", {
  loop: true,

  autoplay: {
    delay: 2000,
    disableOnInteraction: false,
  },

  pagination: {
    el: ".banner-pagination",
    clickable: true,
    dynamicBullets: true,
  },
});
