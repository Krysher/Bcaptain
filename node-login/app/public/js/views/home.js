
$(document).ready(function(){

	var hc = new HomeController();
	var av = new AccountValidator();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
			if (e.responseText == 'email-taken'){
				av.showInvalidEmail();
			}	else if (e.responseText == 'username-taken'){
				av.showInvalidUserName();
			}
		}
	});
	$('#name-tf').focus();

// customize the account settings form //
	
	$('#account-form h2').text('Account Settings');
	$('#account-form #sub1').text('Here are the current settings for your account.');
	$('#user-tf').attr('disabled', 'disabled');
	$('#account-form-btn1').html('Delete');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Update');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h4').text('Delete Account');
	$('.modal-confirm .modal-body p').html('Are you sure you want to delete your account?');
	$('.modal-confirm .cancel').html('Cancel');
	$('.modal-confirm .submit').html('Delete');
	$('.modal-confirm .submit').addClass('btn-danger');


	$('.modal-confirm1').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm1 .modal-header h4').text('Delete Resident');
	$('.modal-confirm1 .modal-body p').html('Are you sure you want to delete this resident?');
	$('.modal-confirm1 .cancel').html('Cancel');
	$('.modal-confirm1 .submit').html('Delete');
	$('.modal-confirm1 .submit').addClass('btn-danger');

	$('.modal-confirm2').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm2 .modal-header h4').text('Delete Event');
	$('.modal-confirm2 .modal-body p').html('Are you sure you want to delete this Event?');
	$('.modal-confirm2 .cancel').html('Cancel');
	$('.modal-confirm2 .submit').html('Delete');
	$('.modal-confirm2 .submit').addClass('btn-danger');


	$('.modal-confirm1').modal({ show : false, keyboard : true, backdrop : true });
	$('#addresident-form-btn1').html('Cancel');
	$('#addresident-form-btn2').html('Submit');


	$('#updateResident-form-btn1').html('Cancel');
	$('#updateResident-form-btn2').html('Update');
});
