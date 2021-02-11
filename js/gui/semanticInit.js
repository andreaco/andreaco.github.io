$('.ui.accordion')
    .accordion()
    ;

$('.menu .item')
    .tab()
    ;

$('.ui.sticky')
    .sticky({
        context: '#example1'
    })
    ;

$('.parametername')
    .popup()
    ;


//=================    POP UP     =======================================================================================================
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

//=================    TABS VISUAL REPRESENTATION     =======================================================================================================

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
