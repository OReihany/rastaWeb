if(section_name == 'list'){
	function runPageFunctions(){
		getBrands();
	}
	function getBrands(){
		var body = {
			brand_name: null,
			is_active: 1,
			page: 1,
			count: 1000
		};
		myCallAjax('/brands/admin/getAll', body, 'POST', getBrands_res, 1);
	}
	function getBrands_res(res){
		switch(res.code){
			case 200:
				var brands = res.data.brands;
				$(brands).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td>${this.brand_name}</td>
							<td>
								<a href="brand-edit.html?brandId=${this.brand_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		getBrand();
	}
	function getBrand(){
		var brand_id = getUrlParameter('brandId');
		var body = {
			brand_id: brand_id
		};
		myCallAjax('/brands/admin/getOne', body, 'POST', getBrand_res, 1);
	}
	function getBrand_res(res){
		switch(res.code){
			case 200:
				var brand = res.data.brand;
				$('#item-form [name="name"]').val(brand.brand_name);
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function updateBrand(){
		var brand_id = getUrlParameter('brandId');
		var brand_name = $('#item-form [name="name"]').val();
		var other_information = {};
		if(
			brand_name != ''
		){
			var body = {
				brand_id: brand_id,
				brand_name: brand_name,
				other_information: other_information,
				is_active: 1
			};
			myCallAjaxByConfirm('/brands/admin/edit', body, 'POST', updateBrand_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateBrand_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteBrand(){
		var brand_id = getUrlParameter('brandId');
		var body = {
			brand_id: brand_id
		};
		myCallAjaxByConfirm('/brands/admin/delete', body, 'POST', deleteBrand_res, 1, 'delete');
	}
	function deleteBrand_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./brands.html');
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
	function addBrand(){
		var brand_name = $('#item-form [name="name"]').val();
		var other_information = {};
		if(
			brand_name != ''
		){
			var body = {
				brand_name: brand_name,
				other_information: other_information,
				is_active: 1
			};
			myCallAjaxByConfirm('/brands/admin/create', body, 'POST', addBrand_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addBrand_res(res){
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
	}
}
