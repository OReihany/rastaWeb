if(section_name == 'list'){
	function runPageFunctions(){
		getShops(1, 1000);
	}
	function getShops(page, count){
		var body = {
			shop_name: null,
			shop_username: null,
			is_active: null,
			page: page,
			count: count
		};
		myCallAjax('/shops/admin/getAll', body, 'POST', getShops_res, 1);
	}
	function getShops_res(res){
		switch(res.code){
			case 200:
				var shops = res.data.shops;
				$(shops).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td>${this.shop_name}</td>
							<td>${this.shop_username}</td>
							<td>
								<a href="shop-edit.html?shopId=${this.shop_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		getShop();
	}
	function getShop(){
		var shop_id = getUrlParameter('shopId');
		var body = {
			"shop_id": shop_id
		};
		myCallAjax('/shops/admin/getOne', body, 'POST', getShop_res, 1);
	}
	function getShop_res(res){
		switch(res.code){
			case 200:
				var shop = res.data.shop;
				$('#item-form [name="name"]').val(shop.shop_name);
				$('#item-form [name="username"]').val(shop.shop_username);
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function updateShop(){
		var shop_id = getUrlParameter('shopId');
		var name = $('#item-form [name="name"]').val();
		var username = $('#item-form [name="username"]').val();
		var password = $('#item-form [name="password"]').val();
		if(
			name != '' &&
			username != '' &&
			password != ''
		){
			var body = {
				shop_id: shop_id,
				shop_name: name,
				shop_username: username,
				shop_password: password,
				shop_address: {},
				shop_information: {},
				other_information: {},
				is_active: 1
			};
			myCallAjaxByConfirm('/shops/admin/edit', body, 'POST', updateShop_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateShop_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteShop(){
		var shop_id = getUrlParameter('shopId');
		var body = {
			shop_id: shop_id
		};
		myCallAjaxByConfirm('/shops/admin/delete', body, 'POST', deleteShop_res, 1, 'delete');
	}
	function deleteShop_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./shops.html');
				}, 1000);
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
}
else if(section_name == 'add'){
	function runPageFunctions(){
	}
	function addShop(){
		var name = $('#item-form [name="name"]').val();
		var username = $('#item-form [name="username"]').val();
		var password = $('#item-form [name="password"]').val();
		if(
			name != '' &&
			username != '' &&
			password != ''
		){
			var body = {
				shop_name: name,
				shop_username: username,
				shop_password: password,
				shop_address: {},
				shop_information: {},
				other_information: {},
				is_active: 1
			};
			myCallAjaxByConfirm('/shops/admin/create', body, 'POST', addShop_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addShop_res(res){
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
		$('#item-form [name="name"]').val('');
		$('#item-form [name="username"]').val('');
		$('#item-form [name="password"]').val('');
	}
}
