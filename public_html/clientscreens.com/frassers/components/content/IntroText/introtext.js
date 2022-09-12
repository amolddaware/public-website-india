import $ from "jquery";
function init() {

  $('.intro_text_container .read-more-btn').on('click', function (e) {
    $(this).hide();
    $('.intro_text_read-more-btn-area .read-less-btn').show();
    $('.intro_text_description .more-text').slideDown();
  });

  $('.intro_text_container .read-less-btn').on('click', function (e) {
    $(this).hide();
    $('.intro_text_read-more-btn-area .read-more-btn').show();
    $('.intro_text_description .more-text').slideUp();
  });
}
document.addEventListener("DOMContentLoaded", init);