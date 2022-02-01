if(section_name == 'list'){
	function runPageFunctions(){
		getComments(1, 1000);
	}

	function getComments(page, count){
		var body = {
			testimonial_name: null,
			is_active: null,
			page: page,
			count: count
		};
		myCallAjax('/testimonials/admin/getAll', body, 'POST', getComments_res, 1);
	}
	function getComments_res(res){
		switch(res.code){
			case 200:
				var comments = res.data.testimonials;
				$(comments).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td>${this.testimonial_name}</td>
							<td>${this.other_information.title}</td>
							<td>${this.other_information.message}</td>
							<td>
								<a href="comment-edit.html?commentId=${this.testimonial_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		getComment();
	}
	function getComment(){
		var comment_id = getUrlParameter('commentId');
		myCallAjax('/testimonials/guest/getOne?testimonial_id='+comment_id, '', 'GET', getComment_res, 1);
	}
	function getComment_res(res){
		switch(res.code){
			case 200:
				var comment = res.data.testimonial;
				$('#item-form [name="name"]').val(comment.testimonial_name);
				$('#item-form [name="title"]').val(comment.other_information.title);
				$('#item-form [name="message"]').val(comment.other_information.message);
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function updateComment(){
		var comment_id = getUrlParameter('commentId');
		var name = $('#item-form [name="name"]').val();
		var title = $('#item-form [name="title"]').val();
		var message = $('#item-form [name="message"]').val();
		if(
			name != '' &&
			title != '' &&
			message != ''
		){
			var body = {
				testimonial_id: comment_id,
				testimonial_name: name,
				other_information: {
					title: title,
					message: message
				},
				is_active: 1
			};
			myCallAjaxByConfirm('/testimonials/admin/edit', body, 'POST', updateComment_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateComment_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteComment(){
		var comment_id = getUrlParameter('commentId');
		var body = {
			testimonial_id: comment_id
		};
		myCallAjaxByConfirm('/testimonials/admin/delete', body, 'DELETE', deleteComment_res, 1, 'delete');
	}
	function deleteComment_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./comments.html');
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
	function addComment(){
		var name = $('#item-form [name="name"]').val();
		var title = $('#item-form [name="title"]').val();
		var message = $('#item-form [name="message"]').val();
		if(
			name != '' &&
			title != '' &&
			message != ''
		){
			var body = {
				testimonial_name: name,
				other_information: {
					title: title,
					message: message
				},
				is_active: 1
			};
			myCallAjaxByConfirm('/testimonials/admin/create', body, 'POST', addComment_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addComment_res(res){
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
		$('#item-form [name="title"]').val('');
		$('#item-form [name="message"]').val('');
	}
}
