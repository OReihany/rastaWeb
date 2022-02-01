if(section_name == 'list'){
	function runPageFunctions(){
		getUsers(1, 1000);
	}
	function getUsers(page, count){
		var body = {
			phone_number: null,
			sms_code: null,
			user_id: null,
			is_active: null,
			page: page,
			count: count
		};
		myCallAjax('/users/admin/getAll', body, 'POST', getUsers_res, 1);
	}
	function getUsers_res(res){
		if(res){
			if(res.code==200){
				var users = res.data.users;
				$('table#items tbody').empty();
				$(users).each(function(){
					var name = (this.user_profile) ? this.user_profile.name + ' ' + this.user_profile.lastname : '';
					var national_code = (this.user_profile) ? this.user_profile.national_code : '';
					var phone_number = this.phone_number;
					$('table#items tbody').append(`
						<tr>
							<td>${phone_number}</td>
						</tr>
					`);
				});
				$('table#items').DataTable();
			}
			else{
				Swal.fire(res.farsi_message, '', 'error');
			}
		}
		else{
			Swal.fire(res.farsi_message, '', 'error');
		}
	}
}