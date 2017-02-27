
function HomeController()
{
// bind event listeners to button clicks //
	var that = this;

	var userId;
// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

// confirm account deletion //
	$('#account-form-btn1').click(function(){$('.modal-confirm').modal('show')});

// handle account deletion //
	$('.modal-confirm .submit').click(function(){ that.deleteAccount(); });

	$('.modal-confirm1 .submit').click(function(){ that.removeResident(userId); });

	this.deleteAccount = function()
	{
		$('.modal-confirm').modal('hide');
		var that = this;
		$.ajax({
			url: '/delete',
			type: 'POST',
			data: { id: $('#userId').val()},
			success: function(data){
	 			that.showLockedAlert('Your account has been deleted C.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showRemoveResident = function(userId)
	{
		userId = userId;
		$('.modal-confirm1').modal('show');
		$('.modal-confirm1 .submit').click(function(){ that.removeResident(userId); });
	}





	this.AddResident = function()
	{
		var Rfirstname = $('input[name=Rfirstname]').val();
		var Rlastname = $('input[name=Rlastname]').val();
		var Remail = $('input[name=Remail]').val();
		var Raddress = $('input[name=Raddress]').val();

		var that = this;
		$.ajax({
			url: '/addresident',
			type: 'POST',
			data: { fn: Rfirstname, ln: Rlastname, email: Remail, address: Raddress},
			success: function(data){
				$('.addResident').modal('hide');
	 			that.showLockedAlertWO('Succesfully added Resident');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}




	this.showUpdateResident = function(firstname, lastname, email, address, id) {
		$('.updateResident').on('show.bs.modal', function(event) {
			$(".updateResident").find('input[name="Ufirstname"]').val(firstname);
			$(".updateResident").find('input[name="Ulastname"]').val(lastname);
			$(".updateResident").find('input[name="Uemail"]').val(email);
			$(".updateResident").find('input[name="Uaddress"]').val(address);
			$(".updateResident").find('input[name="UuserID"]').val(id);
		})

		$('.updateResident').modal('show');

	}

	this.UpdateResident = function()
	{
		var uid = $('input[name=UuserID]').val(); 
		var Rfirstname = $('input[name=Ufirstname]').val();
		var Rlastname = $('input[name=Ulastname]').val();
		var Remail = $('input[name=Uemail]').val();
		var Raddress = $('input[name=Uaddress]').val();
		var that = this;
		$.ajax({
			url: '/updateResident',
			type: 'POST',
			data: { id: uid, fn: Rfirstname, ln: Rlastname, email: Remail, address: Raddress},
			success: function(data){
				$('.updateResident').modal('hide');
	 			that.showLockedAlertWO('Succesfully Update Resident Information');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}




	this.removeResident = function(userId)
	{
		$('.modal-confirm1').modal('hide');
		var that = this;
		$.ajax({
			url: '/delResident',
			type: 'POST',
			data: { id: userId},
			success: function(data){

	 			that.showLockedAlertWO('This Resident has been deleted.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.weird = function() {
		alert('weird');
	}

	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/logout",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('You are now logged out.<br>Redirecting you back to the homepage.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h4').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}


	this.showLockedAlertWO = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h4').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/manage';})
		setTimeout(function(){window.location.href = '/manage';}, 3000);
	}

}

HomeController.prototype.onUpdateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h4').text('Success!');
	$('.modal-alert .modal-body p').html('Your account has been updated.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}

