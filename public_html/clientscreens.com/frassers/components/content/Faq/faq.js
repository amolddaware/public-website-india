import $ from 'jquery';
import Swiper from "swiper/bundle";

export default class Faq {
  constructor() {
    $(".faq_accordion").off();
    $(".faq_accordion").on("click", '.faq_accordion--header', function(event){
      event.preventDefault();
      $(this).parent().find(".faq_accordion--body .faq_accordion--body_container").toggleClass("show_body");
      $(this).find("i").toggleClass("fh-icon-up-arrow")
    })
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new Faq();
});