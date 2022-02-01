if(section_name == 'list'){
	$(document).ready(function(){
		getAdmins();
	});
	function getAdmins(){
		myCallAjax('/admins/admin/getAll', '', 'POST', getAdmins_res, 1);
	}
	function getAdmins_res(res){
		switch(res.code){
			case 200:
				var admins = res.data.admins;
				$(admins).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td>${this.username}</td>
							<td>${this.permissions}</td>
							<td>
								<a href="admin-edit.html?adminId=${this.admin_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
							</td>
						</tr>
					`);
				});
				$('table#items').DataTable();
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
}
else if(section_name == 'edit'){
	function runPageFunctions(){
		getAdmin();
	}
	function getAdmin(){
		var admin_id = getUrlParameter('adminId');
		var body = {
			"admin_id": admin_id
		};
		myCallAjax('/admins/admin/getOne', body, 'POST', getAdmin_res, 1);
	}
	function getAdmin_res(res){
		switch(res.code){
			case 200:
				var admin = res.data.admin;
				$('#item-form [name="username"]').val(admin.username);
				$('#item-form [name="permissions"]').val(admin.permissions.join());
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function updateAdmin(){
		var admin_id = getUrlParameter('adminId');
		var username = $('#item-form [name="username"]').val();
		var permissions = $('#item-form [name="permissions"]').val();
		if(
			username != '' &&
			permissions != ''
		){
			var body = {
				admin_id: admin_id,
				username: username,
				permissions: permissions.split(','),
				password: '123456'
			};
			myCallAjaxByConfirm('/admins/admin/edit', body, 'POST', updateAdmin_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateAdmin_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteAdmin(){
		var admin_id = getUrlParameter('adminId');
		var body = {
			admin_id: admin_id
		};
		myCallAjaxByConfirm('/admins/admin/delete', body, 'POST', deleteAdmin_res, 1, 'delete');
	}
	function deleteAdmin_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./admins.html');
				}, 1000);
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function setAdminPassword(){
		var admin_id = getUrlParameter('adminId');
		var password = $('#item-form2 [name="password"]').val();
		if(
			password != ''
		){
			var body = {
				admin_id: admin_id,
				password: password
			};
			myCallAjaxByConfirm('/admins/admin/setPassword', body, 'POST', setAdminPassword_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function setAdminPassword_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				$('#item-form2 [name="password"]').val('');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
}
else if(section_name == 'add'){
	function runPageFunctions(){
	}
	function addAdmin(){
		var username = $('#item-form [name="username"]').val();
		var password = $('#item-form [name="password"]').val();
		var permissions = $('#item-form [name="permissions"]').val();
		if(
			username != '' &&
			password != '' &&
			permissions != ''
		){
			var body = {
				username: username,
				password: password,
				permissions: permissions.split(',')
			};
			myCallAjaxByConfirm('/admins/admin/add', body, 'POST', addAdmin_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addAdmin_res(res){
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
		$('#item-form [name="username"]').val('');
		$('#item-form [name="password"]').val('');
		$('#item-form [name="permissions"]').val('');
	}
}
