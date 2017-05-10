var magic = $("#wizard")
magic.hide();

$(".createNL").click(function() {
    $(".table-responsive").fadeOut("normal", function() {
        $(this).remove();
        magic.show();
    });
});

magic.steps({
	onStepChanging: function (event, currentIndex, newIndex)
	{
		if (currentIndex > newIndex)
        {
            return true;
        }
        if (newIndex === 3) {
        	generate_preview();
        }
        if (newIndex === 1 && $("#InputNLName").val() == "")
        {
        	alert('Please enter a title for the Newsletter');
            return false;
        } else {
        	return true;
        }
	},
	onFinished: function (event, currentIndex)
	{
		get_everything();	
    	//send email, store data into database and voila!  	
    }
});