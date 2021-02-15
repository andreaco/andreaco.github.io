/**
 * Accordion used for the descriptions in the main page
 */
$('.ui.accordion').accordion();


/**
 * Menu Item used to represent the pattern name list in the modal window
 */
$('.menu .item').tab();


/**
 * Modal Windows used to display error if some parameter is undefined or
 * to display the final generation representation
 */
$(function () {
  $(".featuremodal").modal({
    onShow: function () {
      // On show setup the descriptions of the features popups
      $('.descriptiontooltip').popup();
    },
    onHide: function () {
      // On hide reset the player for the next display
      resetPlayer();
    },
    closable: true
  });
  $(".errormodal").modal({
    closable: true
  });
});


/**
 * Tabs Visual Representation Used to access the different representations (Overview, Balance, ...)
 */
$(document).ready(function () {
  $(".tab_content").hide();
  $("#tab1").show();
  $(".tab:first-child").addClass("active");

  $(".tab").click(function (event) {
    event.preventDefault();
    $(".tab").removeClass("active");
    $(".tab_content").hide();
    $(this).addClass("active");
    $("#" + $(this).attr("rel")).show();
  });
});
