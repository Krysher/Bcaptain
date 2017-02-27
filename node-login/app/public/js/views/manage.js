
$(document).ready(function(){
	
	$('.modal-confirm1').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm1 .modal-header h4').text('Delete Resident');
	$('.modal-confirm1 .modal-body p').html('Are you sure you want to delete this resident?');
	$('.modal-confirm1 .cancel').html('Cancel');
	$('.modal-confirm1 .submit').html('Delete');
	$('.modal-confirm1 .submit').addClass('btn-danger');

});
