import $ from "jquery";

function init() {
  // Show the first tab and hide the rest
  $('.primarytabs__tab li:first-child').addClass('active');
  $('.tab-content').hide();
  $('.tab-content:first').show();

  // Click function
  $('.primarytabs__tab li').click(function(){
    $('.primarytabs__tab li').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').hide();
    
    var activeTab = $(this).find('a').attr('href');
    $(activeTab).fadeIn();
    return false;
  });
  }

  document.addEventListener("DOMContentLoaded", init);