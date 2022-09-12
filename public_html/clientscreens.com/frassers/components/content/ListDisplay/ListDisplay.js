import $ from "jquery";
let selectObject = null;
let dataObj = null;
$(function () {
	$(window).on("load", function () {
		let countryUrl = $(".location-list-view").data("countryUrl");
		let hotelsUrl = $(".location-list-view").data("hotelsUrl");

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
				let content = `<div class="accordion-wrapper ${`accordion-wrapper-${d.countryId}`}">
          <div class="accordion-wrapper__head">${d.country} <span>(${
					d.hotels.length
				})</span></div><div class="accordion-wrapper__body">
          <div class="accordion-wrapper__body__list ${`accordion-list-${d.countryId}`}"></div></div></div>`;
				$(".location-list-view").append($(content));
				const Item = ({ name, stateId, city }) => `
        <div class="accordion-wrapper__body__list__item ${`accordion-list-item-${stateId}`}">
        <strong>${city}</strong>
        <p>${name}</p>
      </div>
        `;
				$(`.accordion-list-${d.countryId}`).append(
					d.hotels.map(Item).join("")
				);
				init();
			});
		};

		let countrySelect = $("#country");
		let stateSelect = $("#state");

		$(countrySelect).on("change", function () {
			$(".accordion-wrapper__body__list__item").show();
			$(".accordion-wrapper").hide();
			$(
				`.accordion-wrapper-${$(this).find(":selected").data("id")}`
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
			$(".accordion-wrapper__body__list__item").hide();
			$(
				`.accordion-list-item-${$(this).find(":selected").data("id")}`
			).show();
		});
	});
});

function init() {
	$(".accordion-wrapper__head").unbind();
	$(".accordion-wrapper__head").click(function (e) {
		e.preventDefault();
		$(this).next().slideToggle();
		$(this).toggleClass("active");
	});
}

document.addEventListener("DOMContentLoaded", init);
