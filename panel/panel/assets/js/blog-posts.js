if(section_name == 'list'){
	function runPageFunctions(){
		getPosts(1, 1000);
	}
	function getPosts(page, count){
		var body = {
			post_title: null,
			post_tags: null,
			is_promote: null,
			is_active: null,
			page: page,
			count: count
		};
		myCallAjax('/blogposts/admin/getAll', body, 'POST', getPosts_res, 1);
	}
	function getPosts_res(res){
		switch(res.code){
			case 200:
				var posts = res.data.posts;
				$(posts).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td>${this.post_title}</td>
							<td><img src="${this.post_gallery.url}" style="width:50px;" /></td>
							<td>
								<a href="blog-post-edit.html?postId=${this.post_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		myCallAjax('/blogcategories/admin/getAll', body, 'POST', getCategories_res, 1);
	}
	function getCategories_res(res){
		if(res){
			if(res.code==200){
				var categories = res.data.categories;
				$(categories).each(function(){
					$('select#category').append(`<option value="${this.category_id}">${this.category_name}</option>`);
				});
				getPost();
			}
			else{
				Swal.fire(res.farsi_message, '', 'error');
			}
		}
		else{
			Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function getPost(){
		var post_id = getUrlParameter('postId');
		var body = {
			post_id: post_id
		};
		myCallAjax('/blogposts/admin/getOne', body, 'POST', getPost_res, 1);
	}
	function getPost_res(res){
		switch(res.code){
			case 200:
				var post = res.data.post;
				$('#item-form [name="title"]').val(post.post_title);
				$('#item-form [name="desc"]').val(post.post_description);
				$('#item-form [name="brief"]').val(post.post_brief);
				$('#item-form [name="tags"]').val(post.post_tags.join('-'));
				$('#item-form [name="category"] option[value="'+post.category_id+'"]').prop('selected', true);
				$('#item-form img.uploaded-icon').attr('src', post.post_gallery.url);
				if(post.is_active == 1){
					$('#item-form [name="activation"]').prop('checked', true);
					$('#item-form [name="activation"]').parent().addClass('checked');
				}
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function updatePost(){
		var post_id = getUrlParameter('postId');
		var post_title = $('#item-form [name="title"]').val();
		var post_brief = $('#item-form [name="brief"]').val();
		var post_description = $('#item-form [name="desc"]').val();
		var post_gallery = $('#item-form .uploaded-icon').attr('src');
		var post_tags = $('#item-form [name="tags"]').val().split('-');
		var category_id = $('#item-form [name="category"] option').filter(':selected').val();
		var is_active = 0;
		if($('#item-form [name="activation"]').is(':checked')){
			is_active = 1;
		}
		if(
			post_title != '' &&
			post_brief != '' &&
			post_description != '' &&
			post_tags != '' &&
			post_gallery != '' 
		){
			var body = {
				post_id: post_id,
				post_title: post_title,
				post_brief: post_brief,
				post_description: post_description,
				post_gallery: {
					url: post_gallery
				},
				post_tags: post_tags,
				category_id: category_id,
				other_information: {},
				is_active: is_active,
				is_promote: 0
			};
			myCallAjaxByConfirm('/blogposts/admin/edit', body, 'POST', updatePost_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updatePost_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deletePost(){
		var post_id = getUrlParameter('postId');
		var body = {
			post_id: post_id
		};
		myCallAjaxByConfirm('/blogposts/admin/delete', body, 'DELETE', deletePost_res, 1, 'delete');
	}
	function deletePost_res(res){
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
		myCallAjax('/blogcategories/admin/getAll', body, 'POST', getCategories_res, 1);
	}
	function getCategories_res(res){
		if(res){
			if(res.code==200){
				var categories = res.data.categories;
				$(categories).each(function(){
					$('select#category').append(`<option value="${this.category_id}">${this.category_name}</option>`);
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
	function addPost(){
		var post_title = $('#item-form [name="title"]').val();
		var post_brief = $('#item-form [name="brief"]').val();
		var post_description = $('#item-form [name="desc"]').val();
		var post_gallery = $('#item-form .uploaded-icon').attr('src');
		var post_tags = $('#item-form [name="tags"]').val().split('-');
		var category_id = $('#item-form [name="category"] option').filter(':selected').val();
		var is_active = 0;
		if($('#item-form [name="activation"]').is(':checked')){
			is_active = 1;
		}
		if(
			post_title != '' &&
			post_brief != '' &&
			post_description != '' &&
			post_tags != '' &&
			post_gallery != '' 
		){
			var body = {
				post_title: post_title,
				post_brief: post_brief,
				post_description: post_description,
				post_gallery: {
					url: post_gallery
				},
				post_tags: post_tags,
				category_id: category_id,
				other_information: {},
				is_active: is_active,
				is_promote: 0
			};
			myCallAjaxByConfirm('/blogposts/admin/create', body, 'POST', addPost_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addPost_res(res){
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
		$('#item-form [name="activation"]').prop('checked', false);
		$('#item-form [name="activation"]').parent().removeClass('checked');
		$('#item-form [name="title"]').val('');
		$('#item-form [name="desc"]').val('');
		$('#item-form [name="brief"]').val('');
		$('#item-form [name="tags"]').val('');
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