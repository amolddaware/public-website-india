import * as $ from "jquery";
import _, { map } from 'underscore';
import moment from 'moment';
import Swiper from "swiper/bundle";

// import Swiper styles
import 'swiper/swiper-bundle.css';
export default class CuratedOffers {
    constructor() {

        function initSwiperFunction() {
            if ($(".curated_offers.carousel-view").length > 0) {
                var swiper = new Swiper(".curated_swiper", {
              spaceBetween: 30,
              slidesPerView: 3.2,
              free: false,
              watchSlidesVisibility: true,
              watchSlidesProgress: true,
              // Responsive breakpoints
              breakpoints: {
                // when window width is >= 320px
                320: {
                  slidesPerView: 1,
                  spaceBetween: 30
                },
                500: {
                  slidesPerView: 1,
                  spaceBetween: 30
                },
                700: {
                  slidesPerView: 1.5,
                  spaceBetween: 30
                }
              }
            });
            }
        }

        let offerList;
        if ($(".curated_offers").length > 0) {
            let cmp = $(".curated_offers");
            let offerServletURL = cmp.data("offerList");
            let offerApi = cmp.data("offerApi");
            let offerChildClass = ".curated_offers .swiper-wrapper .swiper-slide";
            let template = _.template($(".template_offer_info").html());

            retrieveOfferList();
            function retrieveOfferList() {
                $.ajax({
                    type: 'GET',
                    dataType: "json",
                    url: offerServletURL,
                    success: function(data, status, xhr) {
                        offerList = data;
                        constructorOfferList()
                        initSwiperFunction()
                    }
                });
            }

            function constructorOfferList() {
                var mapList = mapSearchList();
                var offerType = [];

                for (var i = 0; i < mapList.length; i++) {
                    var offerObj = mapList[i];
                    offerType.indexOf(offerObj.offerType) === -1 && offerType.push(offerObj.offerType);
                    $('.curated_offers .swiper-wrapper').append(template(offerObj));
                }

                $(offerChildClass).each(function () {
                    let hotelId = $(this).data("hotelId");
                    let memberRateCode = $(this).data("memberRateCode");
                    let rateCode = $(this).data("rateCode");
                    let offerStartDate = $(this).data("offerStartDate");
                    let offerEndDate = $(this).data("offerEndDate");

                    let overrideRegularPrice = $(this).data("overrideRegularPrice");
                    let overrideRegularPriceValue = $(this).data("overrideRegularPriceValue");
                    let hideRegularPrice = $(this).data("hideRegularPrice");
                    let overrideMemberPrice = $(this).data("overrideMemberPrice");
                    let overrideMemberPriceValue = $(this).data("overrideMemberPriceValue");
                    let hideMemberPrice = $(this).data("hideMemberPrice");

                    if (hotelId) {
                        if (hideRegularPrice) {
                            $(this).find(".normal-price").addClass("invisibility");
                        } else {
                            if (overrideRegularPrice) {
                                $(this).find(".normal-price-text").html(overrideRegularPrice);
                            }
                            if (overrideRegularPriceValue) {
                                $(this).find(".normal-price-display").html("S&#36; "+overrideRegularPriceValue);
                            } else {
                                constructOfferTable(hotelId, '', rateCode, '', '', false, $(this));
                            }
                        }

                        $(this).find(".member-price").addClass("invisibility");
                        if (!hideMemberPrice) {
                            if (overrideMemberPrice) {
                                $(this).find(".member-price-text").html(overrideMemberPrice);
                            }
                            if (overrideMemberPriceValue) {
                                $(this).find(".member-price").removeClass("invisibility");
                                $(this).find(".member-price-display").html("S&#36; "+overrideMemberPriceValue);
                            } else if (memberRateCode) {
                                constructOfferTable(hotelId, memberRateCode, '', '', '', true, $(this));
                            }
                        }
                    } else {
                        $(this).find(".normal-price").addClass("invisibility");
                        $(this).find(".member-price").addClass("invisibility");
                    }
                });

                initOfferButton();
            }

            function constructOfferTable (hotelId, memberRateCode, rateCode, offerStartDate, offerEndDate, isMember, _this) {
                const replacements = {
                    0: hotelId, //hotelId
                    1: 'SGD', //currencyCode
                    2: memberRateCode, //memberRateCode
                    3: rateCode, //rateCode
                    4: offerStartDate, //offerStartDate
                    5: offerEndDate, //offerEndDate
                };

                const ajaxUrl = offerApi.replace(
                    /{(\w+)}/g,
                    (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
                      replacements[placeholderWithoutDelimiters]
                );
                $.ajax({
                    type: 'GET',
                    dataType:"json",
                    url: ajaxUrl,
                    success: function (data, status, xhr) {
                        if(isMember) {
                            if(data.success) {
                                $(_this).find(".member-price").removeClass("invisibility");
                                $(_this).find(".member-price-display").html("S&#36; "+data.data.price);
                            } else {
                                $(_this).find(".member-price").addClass("invisibility");
                            }
                        } else {
                            if(data.success) {
                                $(_this).find(".normal-price-display").html("S&#36; "+data.data.price);
                            } else {
                                $(_this).find(".normal-price").addClass("invisibility");
                            }
                        }
                    },
                    error: function() {
                        if(isMember) {
                            $(_this).find(".member-price").addClass("invisibility");
                        } else {
                            $(_this).find(".normal-price").addClass("invisibility");
                        }
                    }
                });
            }

            function mapSearchList() {
                var countryMap = [];
                var propertyMap = [];
                var countryWiseList = [];

                offerList.map(countryItem => { if (!countryMap.includes(countryItem.country)) { countryMap.push(countryItem.country) } });
                offerList.map(propertyItem => { if (!propertyMap.includes(propertyItem.hotelID)) { propertyMap.push(propertyItem.hotelID) } });

                /*for (var countryCount = 0; countryCount < countryMap.length; countryCount++) {
                    var tempObj = offerList.filter(x => x.country == countryMap[countryCount])
                    countryWiseList.push(...tempObj)
                }*/
                for (var propertyCount = 0; propertyCount < propertyMap.length; propertyCount++) {
                    var tempObj = offerList.filter(x => x.hotelID == propertyMap[propertyCount])
                    countryWiseList.push(...tempObj)
                }

                return countryWiseList;
            }

            function initOfferButton() {
                $(offerChildClass + " .btn-secondary").on('click', function (e) {
                    let _this = $(this).closest(offerChildClass);
                    let hotelId = _this.data("hotelId");
                    let promoCode = _this.data("promoCode");

                    let finalUrl = _this.data("offerDetailsPath");
                    if (hotelId) {
                        $('#booking-form #hotel').val('');
                        $('#booking-form #Promo').val('');
                        $('#booking-form #hotel').val(hotelId);
                        $('#booking-form #Promo').val(promoCode);

                        var url = $('#booking-form').attr('action');
                        var resultData = $('#booking-form').serialize();
                        finalUrl = url + '?' + resultData;
                    }

                    document.getElementById("booking-form").reset();
                    window.open(finalUrl, '_self');
                    window.focus();

                });
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    new CuratedOffers();
});