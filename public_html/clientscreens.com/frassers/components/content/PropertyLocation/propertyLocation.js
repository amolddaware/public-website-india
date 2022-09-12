import $ from "jquery";
import Swiper from "swiper/bundle";

let hotelObj = null;
console.log("aaaaaaa");
const init = () => {
	$(window).on("load", function () {
		console.log("windowload");
		let hotelsUrl = $(".property-location").data("hotelsUrl");
		console.log(hotelsUrl);
		$.ajax({
			type: "GET",
			dataType: "json",
			url: hotelsUrl,
			success: function (data, status, xhr) {
				hotelObj = data;
				startInitMap();
				initData();
			},
		});
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
							color: "#c8bd9f",
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
			let selectedMarkerPos = null;
			hotelObj.map((d) => {
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
						icon:
							d.hotelID === data.hotelID
								? "../../resources/images/marker_clicked.png"
								: "../../resources/images/marker_1.png",
					});

					if (d.hotelID === data.hotelID) {
						selectedMarkerPos = position;
					}

					const contentString = `<div class="property-location__infowindow">
                <div class="property-location__infowindow--carousel-container">
                  <div
                    class="
                      property-location__infowindow--carousel-container--images
                    "
                  >
                      <div class="swiper-container mySwiper">
                      <div class="swiper-wrapper">
                          ${data.images
								.map(
									(image) => `<div class="swiper-slide">
                                  <img class="property-location__infowindow--carousel-container--images-image" loading="lazy" src=${image} alt="" />
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
                          property-location__infowindow--carousel-container--tag
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
                      property-location__infowindow--carousel-container--award
                    "
                  >
                    <img
                      src=${data.awardImage}
                      alt=""
                      loading="lazy"
                      class="
                        property-location__infowindow--carousel-container--award-image
                      "
                    />
                  </div>`
						: ""
				}
          
                </div>
                <div class="property-location__infowindow--details-container">
                  <div
                    class="property-location__infowindow--details-container-top"
                  >
                    <span
                      class="
                        property-location__infowindow--details-container-top-country
                      "
                      >${data.country}</span
                    >
                    <span
                      class="
                        property-location__infowindow--details-container-top-title
                      "
                      >${data.name}</span
                    >
                    <span
                      class="
                        property-location__infowindow--details-container-top-view-details
                      "
                      ><a href=${data.detailsLink}>View Details</a></span
                    >
                  </div>
                  <div
                    class="
                      property-location__infowindow--details-container-bottom
                    "
                  >
                    <div
                      class="
                        property-location__infowindow--details-container-bottom-pricing
                      "
                    >
                      <span
                        class="
                          property-location__infowindow--details-container-bottom-pricing-main
                        "
                      >
                        <span
                          class="
                            property-location__infowindow--details-container-bottom-pricing-main-title
                          "
                          >From</span
                        >
                        <span
                          class="
                            property-location__infowindow--details-container-bottom-pricing-main-price
                          "
                          >S$${data.price}</span
                        >
                      </span>
                      <span
                        class="
                          property-location__infowindow--details-container-bottom-pricing-members
                        "
                      >
                        <span
                          class="
                            property-location__infowindow--details-container-bottom-pricing-members-title
                          "
                          >Members Only</span
                        >
                        <span
                          class="
                            property-location__infowindow--details-container-bottom-pricing-members-price
                          "
                          >S$${data.membersPrice}</span
                        >
                      </span>
                    </div>
                    <div
                      class="
                        property-location__infowindow--details-container-bottom-check-rates
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
									// marker.setIcon(
									// 	"../../resources/images/marker_clicked.png"
									// );
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
				// averageCenter: true,
				styles: clusterStyles,
			});

			var boundsListener = google.maps.event.addListener(
				map,
				"bounds_changed",
				function (event) {
					map.panTo(selectedMarkerPos);
					this.setZoom(10);
					google.maps.event.removeListener(boundsListener);
				}
			);

			let hideAllInfoWindows = (map) => {
				markers.forEach(function (marker) {
					// marker.setIcon("../../resources/images/marker_1.png");
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
			if (hotelObj) {
				initMap();
			} else {
				startInitMap();
			}
		};

		const initData = () => {
			const hotelName = $(".property-location__details-title-hotel-name");
			const hotelAddress = $(".property-location__details-address");
			const hotelPhone = $(".property-location__details-contact-phone");
			const hotelFacsimile = $(
				".property-location__details-contact-facsimile"
			);
			const hotelTollfree = $(
				".property-location__details-contact-tollfree"
			);
			const hotelEmail = $(".property-location__details-contact-email");
			const hotelResemail = $(
				".property-location__details-contact-resemail"
			);
			const hotelAirportInfo = $(
				".property-location__details-airport-info"
			);
			const hotelAirportDistance = $(
				".property-location__details-airport-distance"
			);
			const hotelTransferAvailable = $(
				".property-location__details-airport-transfer-available"
			);

			$(hotelName).text(hotelObj[0].name);
			$(hotelAddress).text(hotelObj[0].address);
			$(hotelPhone).text(hotelObj[0].phone);
			$(hotelFacsimile).text(hotelObj[0].facsimile);
			$(hotelTollfree).text(hotelObj[0].tollfree);
			$(hotelEmail).text(hotelObj[0].email);
			$(hotelResemail).text(hotelObj[0].reservationEmail);
			$(hotelAirportInfo).text(hotelObj[0].airportInfo);
			$(hotelAirportDistance).text(hotelObj[0].distanceToProperty);
			hotelObj[0].transferAvailable
				? $(hotelTransferAvailable).show
				: $(hotelTransferAvailable).hide();
		};
	});
};

document.addEventListener("DOMContentLoaded", init);
