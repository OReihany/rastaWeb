function runPageFunctions(){
	getEmails();
}
function getEmails(){
	myCallAjax('/users/admin/getEmails', '', 'GET', getEmails_res, 1);
}
function getEmails_res(res){
	switch(res.code){
		case 200:
			var emails = res.data.emails;
			var excel_link = res.data.email_link;
			$('.export-as-excel').attr('href', baseUrl+excel_link);
			$(emails).each(function(){
				$('table#items tbody').append(`
					<tr>
						<td>${this.email}</td>
					</tr>
				`);
			});
			break;
		default:
			Swal.fire('خطا', '', 'error');
	}
}