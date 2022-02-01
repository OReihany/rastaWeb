if(page_name == 'user'){
	$(document).ready(function(){
		getUpcommingTickets();
		getPreviousTickets();
	});

	function getUpcommingTickets(){
		myCallAjax('/tickets/user/getUpcoming', '', 'GET', getUpcommingTickets_res, 1);
	}
	function getUpcommingTickets_res(res){
		switch(res.code){
			case 200:
				var tickets = res.data.tickets;
				$(tickets).each(function(i){
					var numbers_content = '';
					$(this.ticket_codes).each(function(){
						numbers_content += '<li>'+this+'</li>';
					});
					$('.draw-ticket-slider').append(`
						<div class="draw-single-ticket">
							<div class="draw-single-ticket__header">
								<div class="left">Tickey#${i}</div>
								<div class="right">Contest No: ${this.contest_information.contest_information.code}</div>
							</div>
							<div class="circle-divider"><img src="assets/images/elements/circle-border.png"></div>
							<ul class="ticket-numbers-list">${numbers_content}</ul>
						</div>
					`);
				});
				runUpcommingTicketsSlider();
				break;
			default:
		}
	}
	function runUpcommingTicketsSlider(){
		$('.draw-ticket-slider').slick({
			slidesToShow: 2,
			slidesToScroll: 1,
			infinite: false,
			speed: 700,
			arrows: true,
			dots: false,
			prevArrow: '<div class="prev"><i class="las la-long-arrow-alt-left"></i></div>',
			nextArrow: '<div class="next"><i class="las la-long-arrow-alt-right"></i></div>',
			responsive: [
				{
					breakpoint: 1200,
					settings: {
						slidesToShow: 2
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1
					}
				}
			]
		});
	}
	
	function getPreviousTickets(){
		myCallAjax('/tickets/user/getAll', '', 'GET', getPreviousTickets_res, 1);
	}
	function getPreviousTickets_res(res){
		switch(res.code){
			case 200:
				var tickets = res.data.tickets;
				$(tickets).each(function(i){
					var numbers_content = '';
					$(this.ticket_codes).each(function(){
						numbers_content += '<li>'+this+'</li>';
					});
					$('.past-draw-wrapper tbody').append(`
						<tr>
							<td><span class="date">${this.contest_information.end_date.substr(0,10)}</span></td>
							<td><span class="contest-no">${this.contest_information.contest_information.code}</span></td>
							<td>
								<ul class="number-list ${(this.ticket_status) ? 'win-list' : ''}">${numbers_content}</ul>
							</td>
							<td><span class="${(this.ticket_status) ? 'win' : 'fail'}">${(this.ticket_status) ? 'Win' : 'No Win'}</span></td>
						</tr>
					`);
				});
				break;
			default:
		}
	}
}
else if(page_name == 'info'){
	function editUserInfo(){
		$('.user-info-card__list input').prop('disabled', false);
		$('.user-info-card__list [name="name"]').focus();
		$('.user-info-card__header button.edit').addClass('d-none');
		$('.user-info-card__header button.update').removeClass('d-none');
	}
	function updateUserInfo(){
		var name = $('.user-info-card__list [name="name"]').val();
		var phone = $('.user-info-card__list [name="phone"]').val();
		var email = $('.user-info-card__list [name="email"]').val();
		var address = $('.user-info-card__list [name="address"]').val();
		$('.user-info-card__header button.update i').removeClass('d-none');
		var body = {
			user_profile: {
				name: name,
				phone: phone,
				email: email,
				address: address
			}
		};
		myCallAjax('/users/user/setProfile', body, 'POST', updateUserInfo_res, 1);
	}
	function updateUserInfo_res(res){
		switch(res.code){
			case 200:
				$('.user-info-card__list input').prop('disabled', true);
				$('.user-info-card__header button.update').addClass('d-none');
				$('.user-info-card__header button.edit').removeClass('d-none');
			default:
		}
		$('.user-info-card__header button.update i').addClass('d-none');
	}
	
	function openAddCommentModal(){
		var user_name = $('.user-info-card__list [name="name"]').val();
		var is_edit_mode = $('.user-info-card button.update').hasClass('d-none');
		if(
			is_edit_mode &&
			user_name != ''
		){
			$('#addCommentModal').modal('show');
		}
		else{
			Swal.fire('enter your name', '', 'error');
		}
	}
	function addComment(){
		var comment = $('#addCommentModal [name="comment_text"]').val();
		$('#addCommentModal input').removeClass('error');
		$('#addCommentModal .error-box').empty();
		if(comment.length > 0){
			$('#addCommentModal .add-comment-button i').removeClass('d-none');
			var body = {
				comment_message: comment,
				other_information: {}
			};
			myCallAjax('/comments/user/add', body, 'POST', addComment_res, 1);
		}
		else{
			$('#addCommentModal [name="comment_text"]').addClass('error');
			$('#addCommentModal .error-box').text('your comment shouldn\'t be empty');
		}
	}
	function addComment_res(res){
		switch(res.code){
			case 200:
				$('.modal').modal('hide');
				$('#addCommentModal [name="comment_text"]').val('');
				break;
			default:
				$('#addCommentModal .error-box').text(res.english_message);
		}
		$('#addCommentModal .add-comment-button i').addClass('d-none');
	}
}
else if(page_name == 'transaction'){
	$(document).ready(function(){
		getAsset();
		getTransactions();
		getDepositInfo();
	});

	function getAsset(){
		myCallAjax('/users/user/getWallet', '', 'GET', getAsset_res, 1);
	}
	function getAsset_res(res){
		switch(res.code){
			case 200:
				var total = parseFloat(res.data.total_value);
				var pos = total.toString().indexOf('.');
				var asset = (pos !== -1) ? total.toString().substr(0, pos+2) : total;
				var tokens = res.data.tokens_list;
				$('.transaction-balance-wrapper .balance').html(asset + '<rtr>RTR</rtr>');
				$(tokens).each(function(){
					$('#withdrawModal select[name="coin"]').append(`
						<option value="${this.contract_id}">${this.coin_symbol}</option>
					`);
				});
				$('#withdrawModal select[name="coin"]').niceSelect();
			default:
		}
	}
	
	function getTransactions(){
		myCallAjax('/users/user/getTransactions', '', 'GET', getTransactions_res, 1);
	}
	function getTransactions_res(res){
		switch(res.code){
			case 200:
				var transactions = res.data.transactions;
				$(transactions).each(function(i){
					$('.all-transaction tbody').append(`
						<tr>
							<td>
								<div class="date">${this.block_timestamp.substr(0,10)}</div>
							</td>
							<td>
								<p>${this.type}</p>
							</td>
							<td>
								<span class="amount" digit>${this.value} <rtr>RTR</rtr></span>
							</td>
						</tr>
					`);
				});
				$('[digit]').digits();
				break;
			default:
		}
	}

	function getDepositInfo(){
		myCallAjax('/users/user/getDeposit', '', 'GET', getDepositInfo_res, 1);
	}
	function getDepositInfo_res(res){
		switch(res.code){
			case 200:
				var wallet = res.data.wallet_address;
				var qr = res.data.qr_address;
				$('#depositModal img.qr-code').attr('src', qr);
				$('#depositModal [name="dest-wallet"]').val(wallet);
			default:
		}
	}

	function withdraw(){
		var coin = $('#withdrawModal [name="coin"]').val();
		var amount = parseInt($('#withdrawModal [name="amount"]').val());
		var wallet = $('#withdrawModal [name="wallet"]').val();
		var wallet_repeat = $('#withdrawModal [name="wallet-repeat"]').val();
		$('#withdrawModal input, #withdrawModal span').removeClass('error');
		$('#withdrawModal .error-box').empty();
		if(amount > 0){
			if(wallet.length > 0){
				if(wallet == wallet_repeat){
					$('#withdrawModal .withdraw-button i').removeClass('d-none');
					var body = {
						amount: amount,
						to_address: wallet,
						contract_id: coin
					};
					myCallAjax('/users/user/withdraw', body, 'POST', withdraw_res, 1);
				}
				else{
					$('#withdrawModal [name="wallet-repeat"]').addClass('error');
				}
			}
			else{
				$('#withdrawModal [name="wallet"]').addClass('error');
			}
		}
		else{
			$('#withdrawModal [name="amount"]').addClass('error');
		}
	}
	function withdraw_res(res){
		switch(res.code){
			case 200:
				$('#withdrawModal').modal('hide');
				$('#withdrawModal [name="amount"]').val('');
				$('#withdrawModal [name="wallet"]').val('');
				$('#withdrawModal [name="wallet-repeat"]').val('');
				Swal.fire(res.english_message, '', 'success');
				break;
			default:
				$('#loginModal .error-box').text(res.english_message);
		}
		$('#withdrawModal .withdraw-button i').addClass('d-none');
	}
}
else if(page_name == 'referral'){
	$(document).ready(function(){
		getReferralInfo();
	});

	function getReferralInfo(){
		myCallAjax('/users/user/getReferral', '', 'GET', getReferralInfo_res, 1);
	}
	function getReferralInfo_res(res){
		switch(res.code){
			case 200:
				var invited_users = res.data.users;
				var total_earned = res.data.total_earned;
				var month_earned = res.data.month_earned;
				$('.referral-crad.total-earned h3').html(total_earned + '<rtr>RTR</rtr>');
				$('.referral-crad.month-earned h3').html(month_earned + '<rtr>RTR</rtr>');
				$(invited_users).each(function(){
					$('.referral-transaction tbody').append(`
						<tr>
							<td>${this.username}</td>
						</tr>
					`);
				});
			default:
		}
	}
}