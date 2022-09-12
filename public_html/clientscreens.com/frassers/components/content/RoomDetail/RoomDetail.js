import $ from "jquery";
import Swiper from "swiper/bundle";
// import Swiper styles
import 'swiper/swiper-bundle.css';
 
export default class RoomDetail {
  constructor() {
    
    var swiper = new Swiper(".compact-wrapper__slider .swiper-container", {
      autoplay: {
        delay: 5000,
      },
      slidesPerView: 1,
      pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
      },
    });
    
    $(".compact-wrapper__readtext").click(function (e) {
      e.preventDefault();
      $(this).hide();
      $(this).prev(".hide-content").slideDown();
    });

    //if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
    if ($(window).width() < 480) {
      $(".amenities__text h3").click(function (e) {
        e.preventDefault();
        $(".amenities__text__desc").toggle();
      });
      $(".amenities__images").click(function (e) {
        e.preventDefault();
        $(".amenities__images img").toggle();
      });
    }
  }
}
 
document.addEventListener("DOMContentLoaded", function() {
  new RoomDetail();
});