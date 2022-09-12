import $ from "jquery";

$(function () {
	$(window).on("load", function () {
		if ($(".property-booking-widget").length > 0) {
			let hotelsArrList;
			let _this = $(".property-booking-widget");
			let hotelListAPI = _this.data("hotelList");
			retrieveHotelList();

			function retrieveHotelList() {
				$.ajax({
					type: "GET",
					dataType: "json",
					url: hotelListAPI,
					success: (data, status, xhr) => {
						let arr = [];
						data.map((d) => {
							arr.push(...d.hotels);
						});
						hotelsArrList = arr;
					},
					error: (e) => {
						console.warn(e);
						// console.log("error data" + JSON.stringify(data));
					},
				});
			}

			$(".auto-search-panel").hide();

			$("#search-hotels").on("keyup", () => {
				let currentValue = $("#search-hotels").val();

				if (currentValue.length > 0) {
					showSearchResult(hotelsArrList, currentValue);
				}

				if (
					currentValue == "" ||
					currentValue == null ||
					currentValue == undefined
				) {
					$(".auto-search-panel").hide();
					$(this).attr(
						"placeholder",
						$(".property-booking-widget").data(
							"propertyPlaceholder"
						)
					);
					$("#hotel").val("");
				}
			});

			$("#search-hotels").on("click", function () {
				$(this).attr(
					"placeholder",
					$(".property-booking-widget").data("propertyPlaceholder")
				);
				$(this).val("");
				$("#hotel").val("");
				$("#countrySelect").val("");
				$("#stateSelect").val("");
			});

			function showSearchResult(resultData, searchValue) {
				let mapList = resultData;
				// globalSearchList = resultData;
				$(".auto-search-panel ul").html("");
				$(".auto-search-panel").show();
				let filterList = mapList.filter((item) => {
					return item.name
						.toLowerCase()
						.includes(searchValue.toLowerCase());
				});
				let showCityList = mapList.filter((item) => {
					return item.city
						.toLowerCase()
						.includes(searchValue.toLowerCase());
				});
				let prevCountry = "";
				let prevCity = "";

				for (
					let listCount = 0;
					listCount < filterList.length;
					listCount++
				) {
					if (prevCountry != filterList[listCount].country) {
						$(".auto-search-panel ul").append(
							"<li class='country-name'" +
								+"' data-name='" +
								filterList[listCount].country +
								"' data-hotelID='" +
								filterList[listCount].country +
								"' data-countryId='" +
								filterList[listCount].countryId +
								"'>" +
								filterList[listCount].country +
								"</li>"
						);
					}

					// checkIfCityExist(showCityList, filterList[listCount].city)
					if (
						checkIfCityExist(
							showCityList,
							filterList[listCount].city
						) &&
						prevCity != filterList[listCount].city
					) {
						// console.log(filterList[listCount].city)
						$(".auto-search-panel ul").append(
							"<li class='city-name'" +
								+"' data-name='" +
								filterList[listCount].city +
								"' data-hotelID='" +
								filterList[listCount].city +
								"' data-countryId='" +
								filterList[listCount].countryId +
								"' data-stateId='" +
								filterList[listCount].stateId +
								"'>" +
								filterList[listCount].city +
								"</li>"
						);
					}

					// $(".auto-search-panel ul").append(
					// 	"<li data-brand='" +
					// 		filterList[listCount].brand +
					// 		"' data-name='" +
					// 		filterList[listCount].name +
					// 		"' data-hotelID='" +
					// 		filterList[listCount].hotelID +
					// 		"' data-status='" +
					// 		filterList[listCount].status +
					// 		"' data-region='" +
					// 		filterList[listCount].region +
					// 		"' data-country='" +
					// 		filterList[listCount].country +
					// 		"' data-city='" +
					// 		filterList[listCount].city +
					// 		"' data-property='" +
					// 		filterList[listCount].property +
					// 		"'>" +
					// 		filterList[listCount].name +
					// 		"</li>"
					// );
					prevCountry = filterList[listCount].country;
					prevCity = filterList[listCount].city;
				}

				$(".auto-search-panel ul li").on("click", function (e) {
					e.preventDefault();
					e.stopPropagation();
					$(".auto-search-panel").hide();
					$("#search-hotels").val($(this).text());

					if ($(this).hasClass("country-name")) {
						$("#countrySelect").val($(this).data("countryid"));
					} else if ($(this).hasClass("city-name")) {
						$("#countrySelect").val($(this).data("countryid"));
						$("#stateSelect").val($(this).data("stateid"));
					}
				});
			}

			function checkIfCityExist(list, city) {
				let cityCheckMap = list.map((item) => item.city);
				let uniqueCityArray = cityCheckMap.filter(function (item, pos) {
					return cityCheckMap.indexOf(item) == pos;
				});

				return uniqueCityArray.includes(city);
			}

			$(".property-booking-widget_section_icons").on("click", () => {
				let countryId = $("#countrySelect").val();
				let stateId = $("#stateSelect").val();

				let countrySelect = $("#country");
				let stateSelect = $("#state");

				if (countryId && stateId) {
					$(countrySelect).val(countryId).trigger("change");
					$(stateSelect).val(stateId).trigger("change");
				} else if (countryId) {
					$(countrySelect).val(countryId).trigger("change");
					$(stateSelect).val("default");
				}
			});
		}
	});
});
