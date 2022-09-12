import $ from 'jquery';
import Swiper from "swiper/bundle";

export default class RoomTypes {
  constructor() {
    // Swiper options.
    var swiperOptions = {
      // loop: true,
      mode:'horizontal',
      freeMode: false,
      autoplay: false,
      slidesPerView: 3,

      spaceBetween: 30,
      speed: 5000,
      grabCursor: true,
      mousewheelControl: true,
      keyboardControl: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    };
    
    // Initialize swiper.
    var swiper = new Swiper(".room_types__carousel", swiperOptions);

    // Pause autoplay on hover.
    $('.room_types__carousel').on('mouseenter', function(e){
      swiper.autoplay.stop();
    });

    // Start paused autoplay on mouseleave.
    $('.room_types__carousel').on('mouseleave', function(e){
      swiper.autoplay.start();
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
    new RoomTypes();
});