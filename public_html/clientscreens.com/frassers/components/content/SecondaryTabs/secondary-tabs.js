import $ from "jquery";

function init() {
  console.log("start");
  // Show the first tab and hide the rest
  $('.secondarytabs__tab li:first-child').addClass('active');
  $('.tab-content').hide();
  $('.tab-content:first').show();

  // Click function
  $('.secondarytabs__tab li').click(function(){
    $('.secondarytabs__tab li').removeClass('active');
    $(this).addClass('active');
    $('.tab-content').hide();
    
    var activeTab = $(this).find('a').attr('href');
    $(activeTab).fadeIn();
    return false;
  });

  console.log("End");
  }

  document.addEventListener("DOMContentLoaded", init);