window.scrollTo(0,0);

$(document).ready(function(){
	// getGeneralInfo();
});

function getGeneralInfo(type){
	myCallAjax('/admins/guest/getSettings', '', 'POST', getGeneralInfo_res, 0);
}
function getGeneralInfo_res(res){
	if(res){
		if(res.code==200){
			var info = res.data.settings_information;
			$('.hero__content .video-btn').attr('href', info.youtube);
			$('[rtr-phone]').attr('href', 'tel:'+info.phone);
			$('.contact-info__content.phone span').text(info.phone);
			$('.contact-info__content.email span').text(info.email);
			$('.social-card__content.facebook h3').text(info.followers.facebook);
			$('.social-card__content.members h3').text(info.followers.members);
			$('.social-card__content.twitter h3').text(info.followers.twitter);
			$('.social-card__content.subscribers h3').text(info.followers.subscribers);
			$('footer .telegram a').attr('href', info.social.telegram);
			$('footer .instagram a').attr('href', info.social.instagram);
			$('#depositModal .desc').text(info.deposit_text);
		}
		else{
			Swal.fire(res.english_message, '', 'error');
		}
	}
	else{
		Swal.fire(res.english_message, '', 'error');
	}
}

function subscribeEmail(){
    var email = $('.subscribe-form [name="subscribe_email"]').val();
    $('.subscribe-form [name="subscribe_email"]').removeClass('error');
    if(email != ''){
        var body = {
            email: email
        };
        myCallAjax('/users/guest/submitEmail', body, 'POST', subscribeEmail_res, 0);
    }
    else{
        $('.subscribe-form [name="subscribe_email"]').addClass('error');
    }
}
function subscribeEmail_res(res){
	switch(res.code){
		case 200:
			Swal.fire(res.english_message, '', 'success');
			$('.subscribe-form [name="subscribe_email"]').val('');
			break;
		default:
			Swal.fire(res.english_message, '', 'error');
	}
}
