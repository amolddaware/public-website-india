import $ from 'jquery';

export default class GlobalHeader {
  constructor() {
    $(document).off().on("click", ".global-header__container_left--menu-list-container-item--link", function(e){
      e.preventDefault();
      $(this).next().addClass("open_dropdown");
    })

    $(document).mouseup(function (e) {
      var container = $(".list_dropdown");
  
      // if the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass("open_dropdown");
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  new GlobalHeader();
});
