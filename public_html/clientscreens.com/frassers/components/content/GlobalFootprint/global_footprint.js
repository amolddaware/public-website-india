import Swiper from "swiper/bundle";
import $ from 'jquery';

export default class GlobalFootprint {
  constructor() {
    // Swiper options.
    var swiperOptions = {
      loop: true,
      mode:'horizontal',
      freeMode: false,
      autoplay: {
        delay: 500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      slidesPerView: 5,
      spaceBetween: 30,
      speed: 3000,
      grabCursor: true,
      mouseWheelControl: false,
      keyboardControl: true,
      /* navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      } */
    };
    
    // Initialize swiper.
    var swiper = new Swiper(".fr-global-footprint__carousel", swiperOptions);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new GlobalFootprint();
});
