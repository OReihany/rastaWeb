if(section_name == 'change password'){
	function runPageFunctions(){
	}
	function changePassword(){
		var password = $('#item-form [name="password"]').val();
		var new_password = $('#item-form [name="new-password"]').val();
		var new_password_repeat = $('#item-form [name="new-password-repeat"]').val();
		if(
			password != '' &&
			new_password != '' &&
			new_password == new_password_repeat
		){
			var body = {
				password: password,
				new_password: new_password
			};
			myCallAjaxByConfirm('/admins/admin/changePassword', body, 'POST', changePassword_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function changePassword_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				resetFields();
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function resetFields(){
		$('#item-form [name="password"]').val('');
		$('#item-form [name="new-password"]').val('');
		$('#item-form [name="new-password-repeat"]').val('');
	}
}