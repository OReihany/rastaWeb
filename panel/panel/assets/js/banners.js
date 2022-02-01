if(section_name == 'list'){
	function runPageFunctions(){
		getBanners(1, 1000);
	}
	function getBanners(page, count){
		var body = {
			banner_name: null,
			is_active: null,
			page: page,
			count: count
		};
		myCallAjax('/banners/admin/getAll', body, 'POST', getBanners_res, 1);
	}
	function getBanners_res(res){
		switch(res.code){
			case 200:
				var banners = res.data.banners;
				$(banners).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td><img src="${this.banner_description.url}" style="width:50px;" /></td>
							<td>${this.banner_name}</td>
							<td>
								<a href="banner-edit.html?postId=${this.banner_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		getBanner();
	}
	function getBanner(){
		var banner_id = getUrlParameter('postId');
		var body = {
			banner_id: banner_id
		};
		myCallAjax('/banners/admin/getOne', body, 'POST', getBanner_res, 1);
	}
	function getBanner_res(res){
		switch(res.code){
			case 200:
				var banner = res.data.banner;
				$('#item-form [name="name"]').val(banner.banner_name);
				$('#item-form img.uploaded-icon').attr('src', banner.banner_description.url);
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function updateBanner(){
		var banner_id = getUrlParameter('postId');
		var banner_name = $('#item-form [name="name"]').val();
		var banner_url = $('#item-form .uploaded-icon').attr('src');
		if(
			banner_name != '' &&
			banner_url != ''
		){
			var body = {
				banner_id: banner_id,
				banner_name: banner_name,
				banner_description: {
					url: banner_url
				},
				is_active: 1
			};
			myCallAjaxByConfirm('/banners/admin/edit', body, 'POST', updateBanner_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateBanner_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteBanner(){
		var banner_id = getUrlParameter('postId');
		var body = {
			banner_id: banner_id
		};
		myCallAjaxByConfirm('/banners/admin/delete', body, 'DELETE', deleteBanner_res, 1, 'delete');
	}
	function deleteBanner_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./blog-posts.html');
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
	function addBanner(){
		var banner_name = $('#item-form [name="name"]').val();
		var banner_url = $('#item-form .uploaded-icon').attr('src');
		if(
			banner_name != '' &&
			banner_url != ''
		){
			var body = {
				banner_name: banner_name,
				banner_description: {
					url: banner_url
				},
				is_active: 1
			};
			myCallAjaxByConfirm('/banners/admin/create', body, 'POST', addBanner_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addBanner_res(res){
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

// common functions

$('[name="icon"]').change(function(){
	uploadMedia(this, showUploadedIcon);
});
function showUploadedIcon(res){
	if(res){
		if(res.code==200){
			var image_link = res.data.image_address;
			$('img.uploaded-icon').attr('src', image_link);
		}
		else{
			alert('خطا');
		}
	}
	else{
		alert('مشکلی در دریافت اطلاعات پیش آمده است');
	}
}
