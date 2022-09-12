import Swiper from "swiper/bundle";
import $ from "jquery";
let selectObject = null;
let dataObj = null;
export default class LocationCol {
	constructor() {
		var swiper = new Swiper(".lSwiper", {
			autoplay: {
				delay: 5000,
			},
			pagination: {
				el: ".swiper-pagination",
				dynamicBullets: true,
			},
		});
	}
}

document.addEventListener("DOMContentLoaded", function () {
	new LocationCol();
});

$(function () {
	$(window).on("load", function () {
		let countryUrl = $(".location-col-wrapper").data("countryUrl");
		let hotelsUrl = $(".location-col-wrapper").data("hotelsUrl");

		$.ajax({
			type: "GET",
			dataType: "json",
			url: countryUrl,
			success: function (data, status, xhr) {
				selectObject = data;
				getData();
			},
		});

		const getData = () => {
			$.ajax({
				type: "GET",
				dataType: "json",
				url: hotelsUrl,
				success: function (data, status, xhr) {
					dataObj = data;
					loadData();
				},
			});
		};

		const loadData = () => {
			dataObj.map((d) => {
				const Item = ({
					name,
					country,
					stateId,
					images,
					price,
					membersPrice,
				}) => `
        <div class="column-control__image-grid__column ${`column-control-country-${d.countryId}`} ${`column-control-state-${stateId}`}">
          <div class="swiper-container lSwiper">
            <div class="swiper-wrapper">
            ${images
				.map(
					(image) => `<div class="swiper-slide">
                <img  loading="lazy" src=${image} alt="" />
            </div>`
				)
				.join("")}
            </div>
            <div class="swiper-pagination"></div>
          </div>
		  <div class="column-control__image-grid__details">
          	<div class="column-control__image-grid__desc">
          	  <span class="country">${country}</span>
          	  <h5>${name}</h5>
          	  <a href="#">View Details</a>
          	</div>
          	<div class="column-control__image-grid__rate">
          	  <div class="column-control__image-grid__rate__grid">
          	    <div class="left">
          	      <span class="text">FROM</span>
          	      <span class="price">S$${price}</span>
          	    </div>
          	    <div class="right">
          	      <span class="text">MEMBERS ONLY</span>
          	      <span class="price">S$${membersPrice}</span>
          	    </div>
          	  </div>
          	  <a href="#" class="btn btn-check">CHECK RATES</a>
          	</div>
		  </div>
        </div>
        `;

				$(`.location-grid-view`).append(d.hotels.map(Item).join(""));
				new LocationCol();
			});
		};

		let countrySelect = $("#country");
		let stateSelect = $("#state");

		$(".location-grid-view").show();
		$(".location-list-view").hide();
		$(".location-map-view").hide();

		$(".show-list-view, .show-grid-view, .show-map-view").on(
			"click",
			() => {
				$(countrySelect).val("default");
				$(stateSelect).find("option").not(":first").remove();
				$(stateSelect).val("default");
			}
		);

		$(".show-list-view").on("click", () => {
			$(".location-grid-view").hide();
			$(".location-list-view").show();
			$(".location-map-view").hide();
			$(".column-control__dropdown").css({
				borderBottom: "1px solid #dbb47e",
			});
			$(".show-grid-view, .show-map-view, #openFilterpanel").removeClass(
				"active"
			);
			$(".show-list-view").addClass("active");
			$(".accordion-wrapper__body__list__item").show();
			$(".accordion-wrapper").show();
		});

		$(".show-grid-view").on("click", () => {
			$(".location-grid-view").show();
			$(".location-list-view").hide();
			$(".location-map-view").hide();
			$(".column-control__dropdown").css({
				borderBottom: "1px solid #dbb47e",
			});
			$(".show-list-view, .show-map-view, #openFilterpanel").removeClass(
				"active"
			);
			$(".show-grid-view").addClass("active");
			$(".column-control__image-grid__column").show();
		});

		$(".show-map-view").on("click", () => {
			$(".location-grid-view").hide();
			$(".location-list-view").hide();
			$(".location-map-view").show();
			$(".column-control__dropdown").css({ borderBottom: "none" });
			$(".show-grid-view, .show-list-view, #openFilterpanel").removeClass(
				"active"
			);
			$(".show-map-view").addClass("active");
		});

		$(countrySelect).on("change", function () {
			$(".column-control__image-grid__column").hide();

			$(
				`.column-control-country-${$(this)
					.find(":selected")
					.data("id")}`
			).show();
			$(stateSelect).find("option").not(":first").remove();
			$(stateSelect).val("default");
			selectObject.map((data) => {
				if (
					parseInt(data.countryId) ==
					parseInt($(this).find(":selected").val())
				) {
					data.states.map((state) => {
						$(stateSelect).append(
							$("<option></option>")
								.attr("value", state.name)
								.attr("data-latitude", state.latitude)
								.attr("data-longitude", state.longitude)
								.attr("data-id", state.stateId)
								.text(state.name)
						);
					});
				}
			});
		});

		$(stateSelect).on("change", function () {
			$(".column-control__image-grid__column").hide();
			$(
				`.column-control-state-${$(this).find(":selected").data("id")}`
			).show();
		});
	});
});
