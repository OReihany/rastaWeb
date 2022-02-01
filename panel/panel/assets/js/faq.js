if(section_name == 'list'){
	function runPageFunctions(){
		getFaqCategories();
	}
	function getFaqCategories(){
		myCallAjax('/faqs/guest/getAll', '', 'GET', getFaqCategories_res, 1);
	}
	function getFaqCategories_res(res){
		switch(res.code){
			case 200:
				var categories = res.data.categories;
				$(categories).each(function(){
					var questions_content = '';
					$(this.questions).each(function(){
						questions_content += `
							<p>
								<b>${this.question}</b>
								<span>${this.answer}</span>
							</p>
						`;
					});
					$('table#items tbody').append(`
						<tr>
							<td>${this.category_name}</td>
							<td>${questions_content}</td>
							<td>
								<a href="faq-edit.html?faqId=${this.category_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		getFaq();
	}
	function getFaq(){
		var faq_id = getUrlParameter('faqId');
		myCallAjax('/faqs/guest/getOne?category_id='+faq_id, '', 'GET', getFaq_res, 1);
	}
	function getFaq_res(res){
		switch(res.code){
			case 200:
				var faq = res.data.category;
				$('#item-form [name="name"]').val(faq.category_name);
				$('#item-form [name="name-fa"]').val(faq.category_name_fa);
				$(faq.questions).each(function(){
					$('#item-form .questions .list').append(`
						<p data-q-id="${this.question_id}">
							<button onclick="removeFaqQuestion('${this.question_id}')">حذف</button>
							<b class="question-q">${this.question}</b> - 
							<span class="question-a">${this.answer}</span>
							<br>
							<b class="question-q-fa">${this.question_fa}</b> - 
							<span class="question-a-fa">${this.answer_fa}</span>
						</p>
					`);
				});
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function updateFaq(){
		var category_id = getUrlParameter('faqId');
		var category_name = $('#item-form [name="name"]').val();
		var category_name_fa = $('#item-form [name="name-fa"]').val();
		if(
			category_name != '' &&
			category_name_fa != ''
		){
			var body = {
				category_id: category_id,
				category_name: category_name,
				category_name_fa: category_name_fa
			};
			myCallAjaxByConfirm('/faqs/admin/edit', body, 'POST', updateFaq_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateFaq_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteFaq(){
		var category_id = getUrlParameter('faqId');
		var body = {
			category_id: category_id
		};
		myCallAjaxByConfirm('/faqs/admin/delete', body, 'POST', deleteFaq_res, 1, 'delete');
	}
	function deleteFaq_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./faqs.html');
				}, 1000);
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function addFaqQuestion(){
		var category_id = getUrlParameter('faqId');
		var question = $('#item-form .questions [name="question-q"]').val();
		var question_fa = $('#item-form .questions [name="question-q-fa"]').val();
		var answer = $('#item-form .questions [name="question-a"]').val();
		var answer_fa = $('#item-form .questions [name="question-a-fa"]').val();
		if(
			question != '' &&
			question_fa != '' &&
			answer != '' &&
			answer_fa != ''
		){
			var body = {
				category_id: category_id,
				question: question,
				question_fa: question_fa,
				answer: answer,
				answer_fa: answer_fa
			};
			myCallAjaxByConfirm('/faqs/admin/addQuestion', body, 'POST', addFaqQuestion_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addFaqQuestion_res(res){
		switch(res.code){
			case 200:
				var question = res.data.input_bundle;
				$('#item-form .questions .list').append(`
					<p>
						<button onclick="removeFaqQuestion(this)">حذف</button>
						<b class="question-q">${question.question}</b> - 
						<span class="question-a">${question.answer}</span>
						<br>
						<b class="question-q-fa">${question.question_fa}</b> - 
						<span class="question-a-fa">${question.answer_fa}</span>
					</p>
				`);
				$('#item-form .questions [name="question-q"]').val('');
				$('#item-form .questions [name="question-q-fa"]').val('');
				$('#item-form .questions [name="question-a"]').val('');
				$('#item-form .questions [name="question-a-fa"]').val('');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function removeFaqQuestion(question_id){
		var body = {
			question_id: question_id
		};
		myCallAjaxByConfirm('/faqs/admin/deleteQuestion', body, 'POST', removeFaqQuestion_res, 1, 'delete');
	}
	function removeFaqQuestion_res(res){
		switch(res.code){
			case 200:
				var question_id = res.data.input_bundle.question_id;
				$('#item-form .questions .list p[data-q-id="'+question_id+'"]').remove();
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
}
else if(section_name == 'add'){
	function runPageFunctions(){
	}
	function addFaq(){
		var category_name = $('#item-form [name="name"]').val();
		var category_name_fa = $('#item-form [name="name-fa"]').val();
		if(
			category_name != '' &&
			category_name_fa != ''
		){
			var body = {
				category_name: category_name,
				category_name_fa: category_name_fa
			};
			myCallAjaxByConfirm('/faqs/admin/add', body, 'POST', addFaq_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addFaq_res(res){
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
