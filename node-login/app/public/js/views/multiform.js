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
            let result = validate_checkbox("user_selected[]");
            if (result) {
        	   generate_preview();
               return true;
            } else {
                alert("Please select at least 1 member.");
                return false;
            }
        }
        if (newIndex === 2) {
            let result = validate_checkbox("case[]");
            if (result) {
                return true
            } else {
                alert("Please select at least one event");
                return false;
            }
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


function validate_checkbox(eleName) {
    var checkboxs=document.getElementsByName(eleName);
    var okay=false;
    for(var i=0,l=checkboxs.length;i<l;i++)
    {
        if(checkboxs[i].checked)
        {
            okay=true;
            break;
        }
    }
    if(okay) {return true;}
    else {return false;}
}