import Swiper from "swiper/bundle";

export default class BannerCarousel {
  constructor() {
    var swiper = new Swiper(".hero-image-carousel .swiper-container", {
      autoplay: {
        delay: 5000,
      },
      slidesPerView: 1,
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new BannerCarousel();
});