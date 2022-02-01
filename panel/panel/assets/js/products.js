if(section_name == 'list'){
	function runPageFunctions(){
		getProduct();
	}
	function getProduct(){
		myCallAjax('/products/guest/getAll', '', 'GET', getProduct_res, 1);
	}
	function getProduct_res(res){
		switch(res.code){
			case 200:
				var contests = res.data.contests;
				$(contests).each(function(){
					$('table#items tbody').append(`
						<tr>
							<td>${this.contest_name}</td>
							<td>${this.ticket_price}</td>
							<td>${this.start_date.substring(0,10)}</td>
							<td>${this.end_date.substring(0,10)}</td>
							<td>
								<a href="contest-edit.html?contestId=${this.contest_id}" class="btn btn-warning btn-xs"><i class="fa fa-pencil"></i> ویرایش </a>
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
		myCallAjax('/categories/admin/getAll?category_name=', '', 'GET', getCategories_res, 1);
	}
	function getCategories_res(res){
		switch(res.code){
			case 200:
				var categories = res.data.categories;
				$(categories).each(function(){
					$('select#category').append(`<option value="${this.category_id}">${this.category_name}</option>`);
				});
				getProduct();
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function getProduct(){
		var contest_id = getUrlParameter('contestId');
		myCallAjax('/products/guest/getOne?contest_id='+contest_id, '', 'GET', getProduct_res, 1);
	}
	function getProduct_res(res){
		switch(res.code){
			case 200:
				var contest = res.data.contest;
				$('#item-form [name="name"]').val(contest.contest_name);
				$('#item-form [name="name-fa"]').val(contest.contest_information.contest_name_fa);
				$('#item-form [name="category"] option[value="'+contest.category_id+'"]').prop('selected', true);
				$('#item-form img.uploaded-icon').attr('src', contest.contest_information.icon);
				if(contest.is_active == 1){
					$('#item-form [name="activation"]').prop('checked', true);
					$('#item-form [name="activation"]').parent().addClass('checked');
				}
				$('#item-form [name="code"]').val(contest.contest_information.code);
				$('#item-form [name="numbers-count"]').val(contest.contest_information.nums_count);
				$('#item-form [name="numbers-range"]').val(contest.contest_information.nums_range);
				$('#item-form [name="price"]').val(contest.ticket_price);
				$('#item-form [name="rules-title"]').val(contest.rules.title);
				$('#item-form [name="rules-title-fa"]').val(contest.rules.title_fa);
				$('#item-form #rules-desc-content').html(contest.rules.desc);
				$('#item-form #rules-desc-fa-content').html(contest.rules.desc_fa);
				$('#item-form [name="conditions-title"]').val(contest.conditions.title);
				$('#item-form [name="conditions-title-fa"]').val(contest.conditions.title_fa);
				$('#item-form #conditions-desc-content').html(contest.conditions.desc);
				$('#item-form #conditions-desc-fa-content').html(contest.conditions.desc_fa);
				var start_date = moment(contest.start_date.substring(0,10)).format('MM/DD/YYYY');
				var end_date = moment(contest.end_date.substring(0,10)).format('MM/DD/YYYY');
				$('#item-form [name="date"]').val(start_date + ' - ' + end_date);
				$(contest.rewards).each(function(){
					$('#item-form .prizes .list').append(`
						<p>
							<button onclick="removeContestPrize(this)">حذف</button>
							<span class="prize-item-name">${this.reward_name}</span> - 
							<span class="prize-item-count">${this.reward_count}</span> - 
							<span class="prize-item-desc">${this.reward_desc}</span>
							<img src="${this.reward_icon}">
						</p>
					`);
				});
				$('#item-form [name="date"]').daterangepicker(null, function (start, end, label) {
					// console.log(start.toISOString(), end.toISOString(), label);
				});
				$('#item-form2 [name="winner-code"]').val(contest.winner_ticket.join('-'));
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function updateProduct(){
		var contest_id = getUrlParameter('contestId');
		var contest_name = $('#item-form [name="name"]').val();
		var contest_name_fa = $('#item-form [name="name-fa"]').val();
		var nums_count = $('#item-form [name="numbers-count"]').val();
		var nums_range = $('#item-form [name="numbers-range"]').val();
		var category_id = $('#item-form [name="category"] option').filter(':selected').val();
		var is_active = 0;
		if($('#item-form [name="activation"]').is(':checked')){
			is_active = 1;
		}
		var code = $('#item-form [name="code"]').val();
		var icon = $('#item-form .uploaded-icon').attr('src');
		var contest_information = {
			code: code,
			icon: icon,
			nums_count: nums_count,
			nums_range: nums_range,
			contest_name_fa: contest_name_fa
		};
		var ticket_price = $('#item-form [name="price"]').val();
		var start_date = moment($('#item-form [name="date"]').val().substring(0,10), 'MM/DD/YYYY').format('YYYY-MM-DD');
		var end_date = moment($('#item-form [name="date"]').val().substring(13,23), 'MM/DD/YYYY').format('YYYY-MM-DD');
		var rules_title = $('#item-form [name="rules-title"]').val();
		var rules_title_fa = $('#item-form [name="rules-title-fa"]').val();
		var rules_desc = $('#item-form #rules-desc-content').html();
		var rules_desc_fa = $('#item-form #rules-desc-fa-content').html();
		var rules = {
			title: rules_title,
			title_fa: rules_title_fa,
			desc: rules_desc,
			desc_fa: rules_desc_fa
		};
		var conditions_title = $('#item-form [name="conditions-title"]').val();
		var conditions_title_fa = $('#item-form [name="conditions-title-fa"]').val();
		var conditions_desc = $('#item-form #conditions-desc-content').html();
		var conditions_desc_fa = $('#item-form #conditions-desc-fa-content').html();
		var conditions = {
			title: conditions_title,
			title_fa: conditions_title_fa,
			desc: conditions_desc,
			desc_fa: conditions_desc_fa
		};
		var rewards = [];
		// $('#item-form .prizes .list p').each(function(){
		// 	var prize_name = $(this).find('.prize-item-name').text();
		// 	var prize_count = $(this).find('.prize-item-count').text();
		// 	var prize_desc = $(this).find('.prize-item-desc').text();
		// 	var reward_icon = $(this).find('img').attr('src');
		// 	rewards.push({
		// 		reward_name: prize_name,
		// 		reward_icon: reward_icon,
		// 		reward_desc: prize_desc,
		// 		reward_count: prize_count
		// 	});
		// });
		if(
			contest_name != '' &&
			contest_name_fa != '' &&
			nums_count != '' &&
			nums_range != '' &&
			code != '' &&
			icon != '' &&
			ticket_price != '' &&
			start_date != '' &&
			end_date != '' &&
			rules_title != '' &&
			rules_title_fa != '' &&
			conditions_title != '' &&
			conditions_title_fa != ''
		){
			var body = {
				contest_id: contest_id,
				contest_name: contest_name,
				category_id: category_id,
				is_active: is_active,
				contest_information: contest_information,
				ticket_price: ticket_price,
				start_date: start_date,
				end_date: end_date,
				rules: rules,
				conditions: conditions,
				rewards: rewards
			};
			myCallAjaxByConfirm('/products/admin/edit', body, 'POST', updateProduct_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function updateProduct_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				break;
			default:
				Swal.fire(res.farsi_message, '', 'error');
		}
	}
	function deleteProduct(){
		var contest_id = getUrlParameter('contestId');
		var body = {
			contest_id: contest_id
		};
		myCallAjaxByConfirm('/products/admin/delete', body, 'DELETE', deleteProduct_res, 1, 'delete');
	}
	function deleteProduct_res(res){
		switch(res.code){
			case 200:
				Swal.fire(res.farsi_message, '', 'success');
				setTimeout(function(){
					window.location.replace('./products.html');
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
		myCallAjax('/categories/admin/getAll?category_name=', '', 'GET', getCategories_res, 1);
	}
	function getCategories_res(res){
		switch(res.code){
			case 200:
				var categories = res.data.categories;
				$(categories).each(function(){
					$('select#category').append(`<option value="${this.category_id}">${this.category_name}</option>`);
				});
				getProduct();
				break;
			default:
				Swal.fire('خطا', '', 'error');
		}
	}
	function addProduct(){
		var contest_name = $('#item-form [name="name"]').val();
		var contest_name_fa = $('#item-form [name="name-fa"]').val();
		var nums_count = $('#item-form [name="numbers-count"]').val();
		var nums_range = $('#item-form [name="numbers-range"]').val();
		var category_id = $('#item-form [name="category"] option').filter(':selected').val();
		var is_active = 0;
		if($('#item-form [name="activation"]').is(':checked')){
			is_active = 1;
		}
		var code = $('#item-form [name="code"]').val();
		var icon = $('#item-form .uploaded-icon').attr('src');
		var contest_information = {
			code: code,
			icon: icon,
			nums_count: nums_count,
			nums_range: nums_range,
			contest_name_fa: contest_name_fa
		};
		var ticket_price = $('#item-form [name="price"]').val();
		var start_date = moment($('#item-form [name="date"]').val().substring(0,10), 'MM/DD/YYYY').format('YYYY-MM-DD');
		var end_date = moment($('#item-form [name="date"]').val().substring(13,23), 'MM/DD/YYYY').format('YYYY-MM-DD');
		var rules_title = $('#item-form [name="rules-title"]').val();
		var rules_title_fa = $('#item-form [name="rules-title-fa"]').val();
		var rules_desc = $('#item-form #rules-desc-content').html();
		var rules_desc_fa = $('#item-form #rules-desc-fa-content').html();
		var rules = {
			title: rules_title,
			title_fa: rules_title_fa,
			desc: rules_desc,
			desc_fa: rules_desc_fa
		};
		var conditions_title = $('#item-form [name="conditions-title"]').val();
		var conditions_title_fa = $('#item-form [name="conditions-title-fa"]').val();
		var conditions_desc = $('#item-form #conditions-desc-content').html();
		var conditions_desc_fa = $('#item-form #conditions-desc-fa-content').html();
		var conditions = {
			title: conditions_title,
			title_fa: conditions_title_fa,
			desc: conditions_desc,
			desc_fa: conditions_desc_fa
		};
		var rewards = [];
		// $('#item-form .prizes .list p').each(function(){
		// 	var prize_name = $(this).find('.prize-item-name').text();
		// 	var prize_count = $(this).find('.prize-item-count').text();
		// 	var prize_desc = $(this).find('.prize-item-desc').text();
		// 	var reward_icon = $(this).find('img').attr('src');
		// 	rewards.push({
		// 		reward_name: prize_name,
		// 		reward_icon: reward_icon,
		// 		reward_desc: prize_desc,
		// 		reward_count: prize_count
		// 	});
		// });
		if(
			contest_name != '' &&
			contest_name_fa != '' &&
			nums_count != '' &&
			nums_range != '' &&
			code != '' &&
			icon != '' &&
			ticket_price != '' &&
			start_date != '' &&
			end_date != '' &&
			rules_title != '' &&
			rules_title_fa != '' &&
			conditions_title != '' &&
			conditions_title_fa != ''
		){
			var body = {
				contest_name: contest_name,
				category_id: category_id,
				is_active: is_active,
				contest_information: contest_information,
				ticket_price: ticket_price,
				start_date: start_date,
				end_date: end_date,
				rules: rules,
				conditions: conditions,
				rewards: rewards
			};
			myCallAjaxByConfirm('/products/admin/add', body, 'POST', addProduct_res, 1, 'add');
		}
		else{
			Swal.fire('اطلاعات را درست وارد کنید', '', 'error');
		}
	}
	function addProduct_res(res){
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
		$('#item-form [name="name-fa"]').val('');
		$('#item-form [name="code"]').val('');
		$('#item-form [name="price"]').val('');
		$('#item-form [name="rules-title"]').val('');
		$('#item-form [name="rules-title-fa"]').val('');
		$('#item-form [name="rules-desc"]').val('');
		$('#item-form [name="rules-desc-fa"]').val('');
		$('#item-form [name="conditions-title"]').val('');
		$('#item-form [name="conditions-title-fa"]').val('');
		$('#item-form [name="conditions-desc"]').val('');
		$('#item-form [name="conditions-desc-fa"]').val('');
		$('#item-form [name="date"]').val('');
		$('#item-form .prizes .list').empty();
	}
	$('#item-form [name="date"]').daterangepicker(null, function (start, end, label) {
        // console.log(start.toISOString(), end.toISOString(), label);
    });
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