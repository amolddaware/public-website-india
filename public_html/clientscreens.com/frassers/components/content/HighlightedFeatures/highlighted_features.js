import $ from 'jquery';
import Swiper from "swiper/bundle";

export default class Services {
  constructor() {

    if($(".services__carousel").length > 0) {
      new Swiper(".services__carousel", {
        slidesPerView: 4,
        spaceBetween: 20
      });

      const $servicesItem = $('.services__item');

      $servicesItem.on('click', function(e) {
        $servicesItem.removeClass('highlighted');
        $(this).addClass('highlighted');
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new Services();
});