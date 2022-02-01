$(document).ready(function(){
	checkLogin();
});

function openSignInModal(){
	$('.modal').modal('hide');
	$('#loginModal').modal('show');
}
function signIn(){
	var username = $('#loginModal [name="login_name"]').val();
	var password = $('#loginModal [name="login_pass"]').val();
	$('#loginModal input').removeClass('error');
	$('#loginModal .error-box').empty();
	var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
	if(username.length > 3){
		if(strongRegex.test(password)){
			$('#loginModal .sign-in-button i').removeClass('d-none');
			var body = {
				username: username,
				user_password: password
			};
			myCallAjax('/users/guest/login', body, 'POST', signIn_res, 0);
		}
		else{
			$('#loginModal [name="login_pass"]').addClass('error');
			$('#loginModal .error-box-password').text('password must be at least 8 characters with an uppercase lowercase and number');
		}
	}
	else{
		$('#loginModal [name="login_name"]').addClass('error');
		$('#loginModal .error-box-name').text('username must be at least 4 characters');
	}
}
function signIn_res(res){
	$('#loginModal .sign-in-button i').addClass('d-none');
	switch(res.code){
		case 200:
			var token = res.data.token;
			$('.modal').modal('hide');
			$('.header__top .user__btn').attr('data-toggle', '');
			$('.header__top .user__btn').attr('href', './user.html');
			setCookie('rtr-user-token', token, 1000);
		default:
			$('#loginModal .error-box-all').text(res.english_message);
	}
}

function openSignUpModal(){
	$('.modal').modal('hide');
	$('#signupModal').modal('show');
}
function signUp(){
	var username = $('#signupModal [name="signup_name"]').val();
	var password = $('#signupModal [name="signup_pass"]').val();
	var re_password = $('#signupModal [name="signup_re-pass"]').val();
	var inviter_code = $('#signupModal [name="signup_inviter"]').val();
	var is_agree_rules = $('#signupModal [name="agree-rules"]').prop('checked');
	$('#signupModal input, #signupModal span').removeClass('error');
	$('#signupModal .error-box').empty();
	var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
	if(username.length > 3){
		if(strongRegex.test(password)){
			if(password == re_password){
				if(is_agree_rules){
					$('#signupModal .sign-up-button i').removeClass('d-none');
					var body = {
						username: username,
						user_password: password,
						inviter_code: inviter_code
					};
					myCallAjax('/users/guest/register', body, 'POST', signUp_res, 0);
				}
				else{
					$('#signupModal .agree-custom').addClass('error');
					$('#signupModal .error-box-rules').text('please check rules agreement');
				}
			}
			else{
				$('#signupModal [name="signup_re-pass"]').addClass('error');
				$('#signupModal .error-box-password-confirm').text('enter password correctly');
			}
		}
		else{
			$('#signupModal [name="signup_pass"]').addClass('error');
			$('#signupModal .error-box-password').text('password must be at least 8 characters with an uppercase lowercase and number');
		}
	}
	else{
		$('#signupModal [name="signup_name"]').addClass('error');
		$('#signupModal .error-box-name').text('username must be at least 4 characters');
	}
}
function signUp_res(res){
	$('#signupModal .sign-up-button i').addClass('d-none');
	switch(res.code){
		case 200:
			var token = res.data.token;
			var pv = res.data.private_result;
			setCookie('rtr-user-token', token, 1000);
			$('#privateInfoModal [name="phrase"]').val(pv.phrase);
			$('#privateInfoModal [name="private-key"]').val(pv.private_key);
			$('.modal').modal('hide');
			$('#privateInfoModal').modal('show');
			$('.header__top .user__btn').attr('data-toggle', '');
			$('.header__top .user__btn').attr('href', './user.html');
			break;
		default:
			$('#signupModal .error-box-all').text(res.english_message);
	}
}

function openForgetModal(){
	$('.modal').modal('hide');
	$('#forgetModal').modal('show');
}
function resetPassword(){
	var phrase = $('#forgetModal [name="forget_phrase"]').val();
	var password = $('#forgetModal [name="forget_password"]').val();
	var re_password = $('#forgetModal [name="forget_confirm_password"]').val();
	$('#forgetModal input, #forgetModal span').removeClass('error');
	$('#forgetModal .error-box').empty();
	var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
	if(phrase.length > 12){
		if(strongRegex.test(password)){
			if(password == re_password){
				$('#forgetModal .reset-password-button i').removeClass('d-none');
				var body = {
					phrase: phrase,
					password: password
				};
				myCallAjax('/users/guest/resetPassword', body, 'POST', resetPassword_res, 0);
			}
			else{
				$('#forgetModal [name="forget_confirm_password"]').addClass('error');
				$('#forgetModal .error-box-password-confirm').text('enter password correctly');
			}
		}
		else{
			$('#forgetModal [name="forget_password"]').addClass('error');
			$('#forgetModal .error-box-password').text('password must be at least 8 characters with an uppercase lowercase and number');
		}
	}
	else{
		$('#forgetModal [name="forget_phrase"]').addClass('error');
		$('#forgetModal .error-box-phrase1`').text('enter phrase correctly');
	}
}
function resetPassword_res(res){
	$('#forgetModal .reset-password-button i').addClass('d-none');
	switch(res.code){
		case 200:
			var token = res.data.token;
			var pv = res.data.private_result;
			setCookie('rtr-user-token', token, 1000);
			$('#privateInfoModal [name="phrase"]').val(pv.phrase);
			$('#privateInfoModal [name="private-key"]').val(pv.private_key);
			$('.modal').modal('hide');
			$('#privateInfoModal').modal('show');
			$('.header__top .user__btn').attr('data-toggle', '');
			$('.header__top .user__btn').attr('href', './user.html');
			break;
		default:
			$('#forgetModal .error-box-all').text(res.english_message);
	}
}

function logOut(){
	setCookie('rtr-user-token', '');
	if(page_section && (
		page_section=='profile' ||
		page_section=='cart'
	)){
		window.location.replace('./index.html');
	}
}

function checkLogin(){
	if(getCookie('rtr-user-token') && getCookie('rtr-user-token')!=''){	
		myCallAjax('/users/user/getProfile', '', 'POST', checkLogin_res, 1);
	}
	else{
		logOut();
	}
}
function checkLogin_res(res){
	switch(res.code){
		case 409:
			logOut();
			break;
		case 200:
			$('.header__top .user__btn').attr('data-toggle', '');
			$('.header__top .user__btn').attr('href', './user.html');
			if(page_section == 'profile'){
				var profile = res.data.profile;
				setProfileInfo(profile);
			}
			break;
		default:
	}
}

function setProfileInfo(profile){
	$('.user-card__name').text(profile.username);
	$('.user-card__id').text('ID: ' + profile.invite_code);
	switch(page_name){
		case 'referral':
			$('.referral-link-wrapper input[type="text"]').val('https://RagsToRiches.com/?ref=' + profile.invite_code);
			break;
		case 'info':
			if(profile.user_profile){
				$('.user-info-card__list [name="name"]').val(profile.user_profile.name);
				$('.user-info-card__list [name="phone"]').val(profile.user_profile.phone);
				$('.user-info-card__list [name="email"]').val(profile.user_profile.email);
				$('.user-info-card__list [name="address"]').val(profile.user_profile.address);
			}
			break;
	}
}