/**
 * Accordion
 */
$('.ui.accordion').accordion();


/**
 * Menu Item
 */
$('.menu .item').tab();


/**
 * Modal Windows
 */
$(function(){
	$(".featuremodal").modal({
        onHide: function() {
            resetPlayer();
        },
		closable: true
	});
    $(".errormodal").modal({
       closable: true 
    });
});


/**
 * Tabs Visual Representation
 */
$(document).ready(function() {
    $(".tab_content").hide();
    $("#tab1").show();
    $(".tab:first-child").addClass("active");
    
    $(".tab").click(function(event){
      event.preventDefault();
      $(".tab").removeClass("active");
      $(".tab_content").hide();
      $(this).addClass("active");
      $("#"+$(this).attr("rel")).show();
    });
  });
