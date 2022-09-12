

import $ from "jquery";

function init() {

  if($(".content-carusel").length>0)
  {
    var currentSlideIndex = 0;
  
  showSlides(currentSlideIndex);
   $(".content-carusel #prev").on("click",function (e) {
    e.preventDefault();
    

    showSlides(currentSlideIndex-1);
  });
  $(".content-carusel #next").on("click",function (e) {
    
    e.preventDefault();
    showSlides(currentSlideIndex+1);
  });
  function showSlides(slideToShow) {
    let leftslides = $(".content-carusel_slides_left_card").get();
    let rightslides = $(".content-carusel_slides_right").get();
     if(slideToShow<0)
     {
       slideToShow=leftslides.length-1;
     }
     else if(slideToShow>=leftslides.length)
     {
       slideToShow=0;
     }
     currentSlideIndex=slideToShow;
       var i;
    for (i = 0; i < leftslides.length; i++) {
      leftslides[i].style.display = "none";
      rightslides[i].style.display = "none";
    }
    leftslides[slideToShow].style.display = "block";
    rightslides[slideToShow].style.display = "block";
  }
  }
  
}
document.addEventListener("DOMContentLoaded", init);
