
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
	 			that.showLockedAlert('Your account has been deleted.<br>Redirecting you back to the homepage.');
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


/*
	this.getCalendnar = function(userId) {
		$.ajax({
			url: '/getCalendar',
			type: 'POST',
			data: { id: $('#userId').val()},  //this is practically a god damn backdoor (big vulnerability)
			success: function(data){
				return newsData;
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
*/

	this.AddResident = function()
	{
		var Rfirstname = $('input[name=Rfirstname]').val();
		var Rlastname = $('input[name=Rlastname]').val();
		var Remail = $('input[name=Remail]').val();
		var Raddress = $('input[name=Raddress]').val();
		var RcreatorID = $('input[name=RcreatorID]').val();

		var that = this;
		$.ajax({
			url: '/addresident',
			type: 'POST',
			data: { fn: Rfirstname, ln: Rlastname, email: Remail, address: Raddress, creatorID: RcreatorID},
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






// FOR NEWS

		this.showRemoveNews = function(userId)
	{
		userId = userId;
		$('.modal-confirm2').modal('show');
		$('.modal-confirm2 .submit').click(function(){ that.removeNews(userId); });
	}



		this.addNews = function()
	{
		var event_name     = $('input[name=event_name]').val();
		var event_type     = $('select[name=event_type]').val();
		var event_duration = $('input[name=event_duration]').val();
		var event_date     = $('input[name=event_date]').val();
		var creator        = $('input[name=creator]').val();
		var creatorID      = $('input[name=creatorID]').val();
		var event_dec	   = $('#eventDescription').val();
		var that = this;
		console.log(event_duration);
		$.ajax({
			url: '/addNews',
			type: 'POST',
			data: { en: event_name, edur: event_duration, et: event_type, ed: event_date, dec: event_dec, creator: creator, creatorID: creatorID},
			success: function(data){
				$('.addNews').modal('hide');
	 			that.showLockedAlertNM('Succesfully added Event');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}



	this.showUpdateNews = function(event_name, event_type, event_duration, event_date, event_id, event_dec) {
		//console.log(event_name);
		$('.updateNews').on('show.bs.modal', function(event) {
			$(".updateNews").find('input[name="event_name"]').val(event_name);
			$(".updateNews").find('select[name="event_type"]').val(event_type);
			$(".updateNews").find('input[name="event_date"]').val(event_date);
			$(".updateNews").find('input[name="event_duration"]').val(event_duration);
			$(".updateNews").find('input[name="event_id"]').val(event_id);
			$(".updateNews").find('#eventDescription').val(event_dec);
		})

		$('.updateNews').modal('show');

	}




	this.UpdateNews = function()
	{
		var event_name 		= $('#event_name').val();
		var event_type 		= $('#event_type').val();
		var event_date 		= $(".updateNews").find('input[name="event_date"]').val();
		var event_duration  = $(".updateNews").find('input[name="event_duration"]').val();
		var event_id 		= $('input[name=event_id]').val(); 
		var event_dec	    = $(".updateNews").find('#eventDescription').val();
		var that = this;
		$.ajax({
			url: '/updateNews',
			type: 'POST',
			data: { id: event_id, en: event_name, edur: event_duration, et: event_type, ed: event_date, dec: event_dec},
			success: function(data){
				$('.updateNews').modal('hide');
	 			that.showLockedAlertNM('Succesfully Update Event Information');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.removeNews = function(userId)
	{
		$('.modal-confirm2').modal('hide');
		var that = this;
		$.ajax({
			url: '/delNews',
			type: 'POST',
			data: { id: userId},
			success: function(data){
	 			that.showLockedAlertNM('This Event has been deleted.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.removeNewsletter = function(newsletter_id)
	{
		$('.modal-confirm3').modal('hide');
		var that = this;
		$.ajax({
			url: '/delNewsletter',
			type: 'POST',
			data: { id: newsletter_id},
			success: function(data){
	 			that.showLockedAlertNL('This Newsletter has been deleted.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
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


//for NEWSLETTER
		this.showRemoveNewsletter = function(newsletter_id)
	{
		$('.modal-confirm3').modal('show');
		$('.modal-confirm3 .submit').click(function(){ that.removeNewsletter(newsletter_id); });
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


	this.showLockedAlertNM = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h4').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/news';})
		setTimeout(function(){window.location.href = '/news';}, 3000);
	}
	this.showLockedAlertNL = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h4').text('Success!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/newsletters';})
		setTimeout(function(){window.location.href = '/newsletters';}, 3000);
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

//things are getting complicated

function get_everything() {
	var allSelected = get_selected();
	var resident_selected = allSelected["resident"];
	var event_selected = allSelected["event"];
	
	console.log(event_selected);
	var selected_emails = [];
	var selected_events = [];
	var email_template = global_review;
	var title = document.getElementById('InputNLName').value;
	for (var i = 0; i < resident_selected.length; i++) {
		console.log(resident_selected.length);
		var current_resident_email = resident_selected[i]["resident_email"];
		selected_emails.push(current_resident_email);
	}
	for (var i = 0; i < event_selected.length; i++) {
		console.log(i);
		var current_events_id = event_selected[i]["event_id"];
		selected_events.push(current_events_id);
	}

	$.ajax({
		url: '/addNewsletter',
		type: 'POST',
		data: { nn: title, nr: selected_emails, ei: selected_events, nb: email_template},
		success: function(data){
 			alert('Succesfully added Newsletter');
		},
		error: function(jqXHR){
			console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
		}
	});

}


function get_selected(ele) {
 var event_selected = new Array();
       $.each($("input[name='case[]']:checked"), function() {
           var data = $(this).parents('tr:eq(0)');
           event_selected.push({ 'event_id':$(data).find('td:eq(1)').text(), 'event_name':$(data).find('td:eq(2)').text(), 'event_type':$(data).find('td:eq(3)').text(), 'event_date':$(data).find('td:eq(4)').text(), 'event_duration':$(data).find('td:eq(5)').text(), 'event_dec':$(data).find('td:eq(7)').text()});             
       });
 var resident_selected = new Array();
       $.each($("input[name='user_selected[]']:checked"), function() {
           var data = $(this).parents('tr:eq(0)');
           resident_selected.push({ 'resident_id':$(data).find('td:eq(1)').text(), 'resident_firstname':$(data).find('td:eq(2)').text() , 'resident_email':$(data).find('td:eq(4)').text()});             
       });
    //console.log(values);
    //console.log(user_array);
    return {event: event_selected, resident: resident_selected};
 }

 function generate_preview() {
 	var title = document.getElementById('InputNLName').value;
 	var event_template = "";
 	var now_date = moment().format("MM/DD/YYYY");
 	var myEvent = get_selected()["event"];
 	var myEvent_length = myEvent.length;
 	for (var i = 0; i < myEvent_length; i++) {
 		var local_template = `
 		<div ID="${myEvent[i]['event_type']}">
          ${myEvent[i]['event_type']}
            <!--Event Template - use this section as the template for each entry w/correct clases. Should be easy w/ DOM.-->
            <div class="eventTitle">
              ${myEvent[i]['event_name']} - ${myEvent[i]['event_date']} for ${myEvent[i]['event_duration']}
            </div>
            <div class="${myEvent[i]['event_type']}Desc">
              ${myEvent[i]['event_dec']}
            </div>
        </div>
        <br>
        `
        event_template += local_template;
 	}
 	var data = `
  <style>
	body {
	  background: rgb(204,204,204); 
	}

	page {
	  background: white;
	  display: block;
	  margin: 0 auto;
	  margin-bottom: 0.5cm;
	  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
	  /*padding:20px;*/
	}
	page[size="letter"] {  
	  width: 8.5in;
	  height: 11in; 
	}
	@media print {
	  body, page {
		margin: 0;
		box-shadow: 0;
	  }
	}

	img {
		max-width: 100%;
		max-height: 100%;
	}

	#mainHeaderLogo {
	  display: flex;
	  width: 46%;
	  height: 13%;
	  float: left;
	  padding-top: 25px;
	  padding-left: 25px;
	}

	#mainHeaderBCInfo {
	  display: flex;
	  width: 46%;
	  height: 13%;
	  max-width: 100%;
	  max-height: 100%;
	  float:right;
	  font-size: 16pt;
	  text-align: center;
	  justify-content:center;
	  align-items:center;
	  padding-top: 25px;
	  padding-right: 25px;
	}

	#newsletterTitle {
	  display: block;
	  clear:both;
	  font-size: 20pt;
	  text-align: center;
	  vertical-align: top;
	  padding-top: 15px;
	  padding-bottom: 15px;
	}

	#Event, #Notice, #Information {
	  display: block;
	  clear:both;
	  font-size: 18pt;
	  text-align: left;
	  vertical-align: top;
	  margin-top: 5px;
	  margin-bottom: 5px;
	  margin-left: 25px;
	  margin-right: 25px;
	  padding-top: 5px;
	  padding-bottom: 5px;
	  padding-left: 5px;
	  padding-right: 5px;
	  background-clip:padding-box;
	  border-radius: 10px;
	}

	#Event {
	  background-color:#CBF3DC;
	}

	#Notice {
	  background-color:#FCE7C4;
	}

	#Information {
	  background-color:#CDE6F6;
	}

	.EventTitle, .NoticeTitle, .InfoTitle {
	  display: block;
	  clear:both;
	  font-size: 16pt;
	  text-align: left;
	  vertical-align: top;
	  padding-top: 5px;
	  padding-bottom: 5px;
	  padding-left: 30px;
	}

	.EventDesc, .NoticeDesc, .InformationDesc {
	  display: block;
	  clear:both;
	  font-size: 14pt;
	  text-align: left;
	  vertical-align: top;
	  padding-top: 5px;
	  padding-bottom: 5px;
	  padding-left: 45px;
	}
  </style>
  	<page size="letter">

      <!--Main header-->
      <div ID="mainHeaderLogo">
    		<img src="/images/logoHiRes.png" />
      </div>
    	<div ID="mainHeaderBCInfo">
      	${theAddress}<br>${theName} – Block Captain<br>${now_date}
  	  </div>

      <!--Body-->
      <div ID="newsletterTitle">
      	${title}
      </div>
      ${event_template}
  	</page>
`
 	$("#wizard-p-3").html(data)
 	global_review = data;
 }

 $("#search").keyup(function() {
    _this = this;
    // Show only matching TR, hide rest of them
    $.each($("table tbody tr"), function() {
        if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
           $(this).hide();
        else
           $(this).show();                
    });
});


