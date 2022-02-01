if(section_name == 'list'){
	function runPageFunctions(){
		getCategories();
	}
	function getCategories(){
		myCallAjax('/categories/admin/getAll?category_name=', '', 'GET', getCategories_res, 1);
	}
	function getCategories_res(res){
		switch(res.code){
			case 200:
				var categories = res.data.categories;
				$(categories).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td>${this.category_name}</td>
							<td>
								<a href="category-edit.html?categoryId=${this.category_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		getCategories();
	}
	function getCategories(){
		var body = {
			category_name: null,
			parent_id: null,
			is_active: 1,
			page: 1,
			count: 1000
		};
		myCallAjax('/categories/admin/getAll', body, 'POST', getCategories_res, 1);
	}
	function getCategories_res(res){
		if(res){
			if(res.code==200){
				var categories = res.data.categories;
				$(categories).each(function(){
					$('select#parent').append(`<option value="${this.category_id}">${this.category_name}</option>`);
				});
				getCategory();
			}
			else{
				Swal.fire(res.farsi_message, '', 'error');
			}
		}
		else{
			Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function getCategory(){
		var category_id = getUrlParameter('categoryId');
		var body = {
			category_id: category_id
		};
		myCallAjax('/categories/admin/getOne', body, 'POST', getCategory_res, 1);
	}
	function getCategory_res(res){
		switch(res.code){
			case 200:
				var category = res.data.category;
				$('#item-form [name="name"]').val(category.category_name);
				$('#item-form [name="parent"] option[value="'+category.parent_id+'"]').prop('selected', true);
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function updateCategory(){
		var category_id = getUrlParameter('categoryId');
		var category_name = $('#item-form [name="name"]').val();
		var other_information = {};
		var parent_id = $('#item-form [name="parent"] option').filter(':selected').val();
		if(parent_id =='')
			parent_id = null;
		if(
			category_name != ''
		){
			var body = {
				category_id: category_id,
				category_name: category_name,
				parent_id: parent_id,
				other_information: other_information,
				is_active: 1
			};
			myCallAjaxByConfirm('/categories/admin/edit', body, 'POST', updateCategory_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateCategory_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteCategory(){
		var category_id = getUrlParameter('categoryId');
		var body = {
			category_id: category_id
		};
		myCallAjaxByConfirm('/categories/admin/delete', body, 'POST', deleteCategory_res, 1, 'delete');
	}
	function deleteCategory_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./categories.html');
				}, 1000);
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
}
else if(section_name == 'add'){
	function runPageFunctions(){
		getCategories();
	}
	function getCategories(){
		var body = {
			category_name: null,
			parent_id: null,
			is_active: 1,
			page: 1,
			count: 1000
		};
		myCallAjax('/categories/admin/getAll', body, 'POST', getCategories_res, 1);
	}
	function getCategories_res(res){
		if(res){
			if(res.code==200){
				var categories = res.data.categories;
				$(categories).each(function(){
					$('select#parent').append(`<option value="${this.category_id}">${this.category_name}</option>`);
				});
			}
			else{
				Swal.fire(res.farsi_message, '', 'error');
			}
		}
		else{
			Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function addCategory(){
		var category_name = $('#item-form [name="name"]').val();
		var other_information = {};
		var parent_id = $('#item-form [name="parent"] option').filter(':selected').val();
		if(parent_id =='')
			parent_id = null;
		if(
			category_name != ''
		){
			var body = {
				category_name: category_name,
				parent_id: parent_id,
				other_information: other_information,
				is_active: 1
			};
			myCallAjaxByConfirm('/categories/admin/create', body, 'POST', addCategory_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addCategory_res(res){
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
