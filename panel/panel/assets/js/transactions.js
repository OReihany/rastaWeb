function runPageFunctions(){
	getTransactions();
}
function getTransactions(){
	myCallAjax('/users/admin/getTransactions', '', 'GET', getTransactions_res, 1);
}
function getTransactions_res(res){
	switch(res.code){
		case 200:
			var transactions = res.data.transactions;
			$(transactions).each(function(){
				$('table#items tbody').append(`
					<tr>
						<td>${this.block_timestamp.substr(0,10)}</td>
						<td>${this.value}</td>
						<td>${this.type}</td>
						<td>${this.token_info.address}</td>
					</tr>
				`);
			});
			$('table#items').DataTable();
			break;
		default:
			Swal.fire('خطا', '', 'error');
	}
}