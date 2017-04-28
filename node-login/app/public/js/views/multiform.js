$("#wizard").hide();

$(".createNL").click(function() {
    $(".table-responsive").fadeOut("normal", function() {
        $(this).remove();
        $("#wizard").show();
    });
});

$("#wizard").steps();