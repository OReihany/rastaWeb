function sendMessage(){
    var name = $('.contact-form-wrapper [name="name"]').val();
    var email = $('.contact-form-wrapper [name="email"]').val();
    var subject = $('.contact-form-wrapper [name="subject"]').val();
    var message = $('.contact-form-wrapper [name="message"]').val();
    $('.contact-form-wrapper').find('input, textarea').removeClass('error');
	if(name){
        if(email){
            if(subject){
                if(message){
                    $('.contact-form-wrapper .send-message-button i').removeClass('d-none');
                    var body = {
                        message_information: {
                            name: name,
                            email: email,
                            subject: subject,
                            message: message
                        }
                    };
                    myCallAjax('/users/guest/contactMessage', body, 'POST', sendMessage_res, 0);
                }
                else{
                    $('.contact-form-wrapper [name="message"]').addClass('error');
                }
            }
            else{
                $('.contact-form-wrapper [name="subject"]').addClass('error');
            }
        }
        else{
            $('.contact-form-wrapper [name="email"]').addClass('error');
        }
    }
	else{
		$('.contact-form-wrapper [name="name"]').addClass('error');
	}
}
function sendMessage_res(res){
	switch(res.code){
		case 200:
			Swal.fire(res.english_message, '', 'success');
            $('.contact-form-wrapper [name="name"]').val('');
            $('.contact-form-wrapper [name="email"]').val('');
            $('.contact-form-wrapper [name="subject"]').val('');
            $('.contact-form-wrapper [name="message"]').val('');
		default:
	}
	$('.contact-form-wrapper .send-message-button i').addClass('d-none');
}