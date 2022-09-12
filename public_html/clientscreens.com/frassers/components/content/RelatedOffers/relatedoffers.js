import $ from "jquery";
import Swiper from "swiper";  
// import Swiper styles
import 'swiper/swiper-bundle.css';

function init() {
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3.5,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}
document.addEventListener("DOMContentLoaded", init);
