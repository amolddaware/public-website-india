import $ from "jquery";

function init() {
	$("#openFilterpanel").on("click", function () {
		document.getElementById("filter-panel").style.width = "100%";
		document.getElementById("filter-panel").style.height = "100%";

		// let scrollTop =
		// 	window.pageYOffset || document.documentElement.scrollTop;
		// let scrollLeft =
		// 	window.pageXOffset || document.documentElement.scrollLeft;

		// window.onscroll = function () {
		// 	window.scrollTo(scrollLeft, scrollTop);
		// };

		$("body").css("overflow", "hidden");
	});

	$(".close-panel, .overlay-filter").on("click", function () {
		document.getElementById("filter-panel").style.width = "0";
		//window.onscroll = function() {};

		$("body").css("overflow", "auto");
	});

	$(".filter-items_category").unbind();
	$(".filter-items_category").on("click", function () {
		$(this).toggleClass("active");
		if ($(this).hasClass("active")) {
			$(this).next().css("height", "auto");
		} else {
			$(this).next().css("height", "0");
		}
	});

	$(".apply-filters").click(function () {
		$(".filtered-items").empty();
		let filterableItems = document.querySelectorAll('[type="checkbox"]');
		let checked = 0;
		filterableItems.forEach((item) => {
			if ($(item).prop("checked")) {
				checked += 1;
			}
		});
		$(".filtered-items").append(
			`<b>${checked} ${checked > 1 ? "properties" : "property"}</b>`
		);
		for (let l = 0; l < filterableItems.length; l++) {
			if (filterableItems[l].checked == true) {
				$(".filtered-items").append(
					`<a href='#' class='filtered-items-display' data-value=${filterableItems[l].value}>
						${filterableItems[l].value}<span>&times;</span></a>`
				);
			}
		}
		document.getElementById("filter-panel").style.width = "0";
		//window.onscroll = function() {};

		$("body").css("overflow", "auto");

		$(".filtered-items-display").on("click", function (e) {
			e.stopPropagation();
			e.preventDefault();
			let target = e.target;
			var searchingItems = document.querySelectorAll('[type="checkbox"]');
			searchingItems.forEach((item) => {
				if (
					$(item).val() ===
					$(target).closest(".filtered-items-display").data("value")
				) {
					$(item).prop("checked", false);
				}
			});
			$(this).closest(".filtered-items-display").remove();
			if ($(".filtered-items-display").length === 0) {
				$(".filtered-items").empty();
			}
		});
	});

	$(".clear-filters").on("click", function () {
		$("input[type=checkbox]").prop("checked", false);
		$(".filtered-items").empty();
	});

	$("#filter-searchbar").on("keyup", function () {
		var input = document.getElementById("filter-searchbar").value;
		input = input.toLowerCase();
		var searchingItems = document.querySelectorAll('[type="checkbox"]');

		for (var j = 0; j < searchingItems.length; j++) {
			let textValue = searchingItems[j].value;

			if (textValue.toLowerCase().indexOf(input) > -1) {
				let contentDiv =
					searchingItems[j].parentElement.parentElement.parentElement
						.parentElement.previousSibling;
				contentDiv.previousSibling.classList.add("active");
				let panell = contentDiv.previousSibling.nextElementSibling;
				if (panell.style.height) {
					panell.style.height = null;
				} else {
					panell.style.height = "auto";
				}
				searchingItems[j].parentElement.style.display = "inline-block";
			} else {
				searchingItems[j].parentElement.style.display = "none";
			}
		}

		for (i = 0; i < x.length; i++) {
			if (!x[i].innerHTML.toLowerCase().includes(input)) {
				x[i].style.display = "none";
				$(".filter-items_category").display = "none";
			} else {
				x[i].style.display = "list-item";
			}
		}
	});
}

document.addEventListener("DOMContentLoaded", init);
