import * as $ from 'jquery';

function init() {
    if($(".cmp-offer-highlights").length > 0) {
        let offerApi = $(".cmp-offer-highlights").data("offerApi");
        $(".offer-highlights_row-right").each(function(){
            let hotelId = $(this).data("hotelId");
            let memberRateCode = $(this).data("memberRateCode");
            let rateCode = $(this).data("rateCode");
            let offerStartDate = $(this).data("offerStartDate");
            let offerEndDate = $(this).data("offerEndDate");

            $(this).find(".member-price").addClass("invisibility");

            constructOfferTable(hotelId, '', rateCode, '', '', false, $(this));
            if (memberRateCode) {
                constructOfferTable(hotelId, memberRateCode, '', '', '', true, $(this));
            }
        });

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
    }
}

document.addEventListener("DOMContentLoaded", init);