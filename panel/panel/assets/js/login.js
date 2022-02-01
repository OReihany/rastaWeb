$(document).ready(function(){
	setCookie('rasta-admin-token', '', 0);
	setCookie('rasta-admin-username', '', 0);
	setCookie('rasta-admin-permissions', '', 0);
});
function login(){
	var username = $('[name="username"]').val();
	var password = $('[name="password"]').val();
	if(
		username != '' &&
		password != ''
	){
		var body = {
			username: username,
			password: password
		};
		myCallAjax('/admins/admin/login', body, 'POST', login_res, 0);
	}
	else{
		Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
	}
}

function login_res(res){
	if(res){
		if(res.code==200){
			Swal.fire(res.farsi_message, '', 'success');
			var token = res.data.token;
			var profile = res.data.profile;
			setCookie('rasta-admin-token', token, 1);
			setCookie('rasta-admin-username', profile.username, 1);
			setCookie('rasta-admin-permissions', profile.permissions, 1);
			setTimeout(function(){
				window.location.replace('./setting-change-password.html');
			}, 1000);
		}
		else{
			Swal.fire(res.farsi_message, '', 'error');
		}
	}
	else{
		Swal.fire(res.farsi_message, '', 'error');
	}
}

function keyupLogin(e){
    if(event.key === 'Enter') {
        login();        
    }
}
