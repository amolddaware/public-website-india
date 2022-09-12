import $ from 'jquery';
import Swiper from "swiper";  
import 'swiper/swiper-bundle.css'

export default class DesktopImageSlider {
  constructor() {
    if($(".banner-slider-container").length > 0) {
        let timer = $(".banner-slider-container").data("sliderIntervalTime");
        var swiper = new Swiper(".image-slider-Swiper", {
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: "auto",
          spaceBetween: 30,
          loop: true,
          loopFillGroupWithBlank: true,
          pagination: {
              el: '.swiper-pagination',
              clickable: 'true',
              type: 'bullets',
              renderBullet: function(index, className) {
                  return '<span class="' + className + '">' + '<i></i>' + '<b></b>' + '</span>';
              },

          },
          navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
          },
          autoplay: {
              delay: timer,
              disableOnInteraction: false,
          },
          breakpoints: {
              640: {
                  spaceBetween: 20,
              },
              768: {
                  spaceBetween: 40,
              },
              1024: {
                  spaceBetween: 70,
              },
          },

        });
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new DesktopImageSlider();
});
