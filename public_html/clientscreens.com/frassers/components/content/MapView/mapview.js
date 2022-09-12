import $ from "jquery";
import Swiper from "swiper/bundle";
let selectObject = null;
let latLongsArr = null;
$(function () {
	$(window).on("load", function () {
		//Here is my logic now
		let countryUrl = $(".location-map-view").data("countryUrl");
		let hotelsUrl = $(".location-map-view").data("hotelsUrl");

		$.ajax({
			type: "GET",
			dataType: "json",
			url: countryUrl,
			success: function (data, status, xhr) {
				selectObject = data;
				getLatLongData();
			},
		});

		const getLatLongData = () => {
			$.ajax({
				type: "GET",
				dataType: "json",
				url: hotelsUrl,
				success: function (data, status, xhr) {
					latLongsArr = data;
					startInitMap();
				},
			});
		};

		function initMap() {
			let panMap = (lat, lng, zoom = 4) => {
				var latLng = new google.maps.LatLng(lat, lng); //Makes a latlng
				map.panTo(latLng);
				map.setZoom(zoom);
			};

			initMap.panMap = panMap;

			// The location of Uluru
			const uluru = { lat: -25.344, lng: 131.036 };
			let styles = [
				{
					featureType: "administrative",
					elementType: "all",
					stylers: [
						{
							saturation: "-100",
						},
					],
				},
				{
					featureType: "administrative.province",
					elementType: "all",
					stylers: [
						{
							visibility: "off",
						},
					],
				},
				{
					featureType: "landscape",
					elementType: "all",
					stylers: [
						{
							saturation: "-100",
						},
						{
							lightness: 65,
						},
						{
							visibility: "off",
						},
						{
							color: "#fafafa",
						},
					],
				},
				{
					featureType: "poi",
					elementType: "all",
					stylers: [
						{
							saturation: -100,
						},
						{
							lightness: "50",
						},
						{
							visibility: "simplified",
						},
					],
				},
				{
					featureType: "road",
					elementType: "all",
					stylers: [
						{
							saturation: "-100",
						},
					],
				},
				{
					featureType: "road.highway",
					elementType: "all",
					stylers: [
						{
							visibility: "simplified",
						},
						{
							hue: "#ff0000",
						},
					],
				},
				{
					featureType: "road.arterial",
					elementType: "all",
					stylers: [
						{
							lightness: "30",
						},
					],
				},
				{
					featureType: "road.local",
					elementType: "all",
					stylers: [
						{
							lightness: "40",
						},
					],
				},
				{
					featureType: "road.local",
					elementType: "geometry",
					stylers: [
						{
							color: "#dbb47e",
						},
						{
							lightness: "50",
						},
						{
							gamma: "1.00",
						},
					],
				},
				{
					featureType: "transit",
					elementType: "all",
					stylers: [
						{
							saturation: -100,
						},
						{
							visibility: "simplified",
						},
					],
				},
				{
					featureType: "water",
					elementType: "geometry",
					stylers: [
						{
							lightness: -25,
						},
						{
							saturation: -97,
						},
						{
							color: "#dbb47e",
						},
					],
				},
				{
					featureType: "water",
					elementType: "labels",
					stylers: [
						{
							lightness: -25,
						},
						{
							saturation: -100,
						},
					],
				},
				{
					featureType: "administrative.neighborhood",
					elementType: "labels",
					stylers: [
						{
							visibility: "off",
						},
					],
				},
				{
					featureType: "administrative.land_parcel",
					elementType: "labels",
					stylers: [
						{
							visibility: "off",
						},
					],
				},
				{
					featureType: "administrative.locality",
					elementType: "labels",
					stylers: [
						{
							visibility: "off",
						},
					],
				},
			];

			var wonderlinks = $("#country");
			// The map, centered at Uluru
			const map = new google.maps.Map(document.getElementById("map"), {
				disableDefaultUI: true,
				styles,
			});

			let bounds = new google.maps.LatLngBounds();

			const infowindow = new google.maps.InfoWindow();
			let infowindowOpen = false;
			let lastMarker = null;
			let markers = [];
			latLongsArr.map((d) => {
				d.hotels.map((data) => {
					var position = new google.maps.LatLng(
						data.latitude,
						data.longitude
					);
					bounds.extend(position);
					let marker = new google.maps.Marker({
						position: position,
						map: map,
						title: data.country,
						animation: google.maps.Animation.DROP,
						icon: "../../resources/images/marker_1.png",
					});

					const contentString = `<div class="map-view__infowindow">
                <div class="map-view__infowindow--carousel-container">
                  <div
                    class="
                      map-view__infowindow--carousel-container--images
                    "
                  >
                      <div class="swiper-container mySwiper">
                      <div class="swiper-wrapper">
                          ${data.images
								.map(
									(image) => `<div class="swiper-slide">
                                  <img class="map-view__infowindow--carousel-container--images-image" loading="lazy" src=${image} alt="" />
                                  </div>`
								)
								.join("")}
                      </div>
                      <div class="swiper-pagination"></div>
                    </div>
                  </div>
                    ${
						data.newProperty
							? `
                <div
                  class="
                          map-view__infowindow--carousel-container--tag
                        "
                >
                  New Property
                </div>`
							: ""
					}
              ${
					data.awardImage
						? `<div
                    class="
                      map-view__infowindow--carousel-container--award
                    "
                  >
                    <img
                      src=${data.awardImage}
                      alt=""
                      loading="lazy"
                      class="
                        map-view__infowindow--carousel-container--award-image
                      "
                    />
                  </div>`
						: ""
				}
          
                </div>
                <div class="map-view__infowindow--details-container">
                  <div
                    class="map-view__infowindow--details-container-top"
                  >
                    <span
                      class="
                        map-view__infowindow--details-container-top-country
                      "
                      >${data.country}</span
                    >
                    <span
                      class="
                        map-view__infowindow--details-container-top-title
                      "
                      >${data.name}</span
                    >
                    <span
                      class="
                        map-view__infowindow--details-container-top-view-details
                      "
                      ><a href=${data.detailsLink}>View Details</a></span
                    >
                  </div>
                  <div
                    class="
                      map-view__infowindow--details-container-bottom
                    "
                  >
                    <div
                      class="
                        map-view__infowindow--details-container-bottom-pricing
                      "
                    >
                      <span
                        class="
                          map-view__infowindow--details-container-bottom-pricing-main
                        "
                      >
                        <span
                          class="
                            map-view__infowindow--details-container-bottom-pricing-main-title
                          "
                          >From</span
                        >
                        <span
                          class="
                            map-view__infowindow--details-container-bottom-pricing-main-price
                          "
                          >S$${data.price}</span
                        >
                      </span>
                      <span
                        class="
                          map-view__infowindow--details-container-bottom-pricing-members
                        "
                      >
                        <span
                          class="
                            map-view__infowindow--details-container-bottom-pricing-members-title
                          "
                          >Members Only</span
                        >
                        <span
                          class="
                            map-view__infowindow--details-container-bottom-pricing-members-price
                          "
                          >S$${data.membersPrice}</span
                        >
                      </span>
                    </div>
                    <div
                      class="
                        map-view__infowindow--details-container-bottom-check-rates
                      "
                    >
                      <a href=${data.ratesLink}>Check Rates</a>
                    </div>
                  </div>
                </div>
              </div>`;

					google.maps.event.addListener(
						marker,
						"click",
						(function (marker, contentString, infowindow) {
							return function () {
								hideAllInfoWindows(map);
								if (infowindowOpen && lastMarker === marker) {
									infowindowOpen = false;
								} else {
									marker.setIcon(
										"../../resources/images/marker_clicked.png"
									);
									infowindow.setContent(contentString);
									infowindow.open(map, marker);
									infowindowOpen = true;
								}
								lastMarker = marker;
							};
						})(marker, contentString, infowindow)
					);
					map.fitBounds(bounds);
					markers.push(marker);
				});
			});

			var clusterStyles = [
				{
					url: "../../resources/images/marker_1.png",
					textLineHeight: 0,
					className: "mapcluster-text",
					backgroundPosition: "0 0",
					height: 60,
					width: 50,
					fontFamily: "Roboto-Medium",
					textSize: 36,
					textColor: "#222222",
				},
			];

			new MarkerClusterer(map, markers, {
				maxZoom: 12,
				averageCenter: true,
				styles: clusterStyles,
			});

			var boundsListener = google.maps.event.addListener(
				map,
				"bounds_changed",
				function (event) {
					this.setZoom(4);
					google.maps.event.removeListener(boundsListener);
				}
			);

			let hideAllInfoWindows = (map) => {
				markers.forEach(function (marker) {
					marker.setIcon("../../resources/images/marker_1.png");
					infowindow.close(map, marker);
				});
			};

			google.maps.event.addListener(infowindow, "domready", function () {
				let swiper = new Swiper(".mySwiper", {
					pagination: {
						el: ".swiper-pagination",
						dynamicBullets: false,
						clickable: true,
					},
				});
			});

			google.maps.event.addListener(
				infowindow,
				"closeclick",
				function () {
					hideAllInfoWindows(map);
					infowindowOpen = false;
				}
			);
		}

		const startInitMap = () => {
			// 	// latLongsArr && selectObject ? initMap() : startInitMap();
			if (latLongsArr && selectObject) {
				initMap();
				initSelectors();
			} else {
				startInitMap();
			}
		};

		const initSelectors = () => {
			let countrySelect = $("#country");
			let stateSelect = $("#state");

			selectObject.map((data) => {
				$(countrySelect).append(
					$("<option></option>")
						.attr("value", data.countryId)
						.attr("data-latitude", data.latitude)
						.attr("data-longitude", data.longitude)
						.attr("data-id", data.countryId)
						.text(data.country)
				);
			});

			$(countrySelect).on("change", function () {
				initMap.panMap(
					$(this).find(":selected").data("latitude"),
					$(this).find(":selected").data("longitude"),
					4
				);
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
									.attr("value", state.stateId)
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
				initMap.panMap(
					$(this).find(":selected").data("latitude"),
					$(this).find(":selected").data("longitude"),
					8
				);
			});
		};
	});
});
