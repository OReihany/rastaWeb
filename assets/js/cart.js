$(document).ready(function(){
	getCart();
});

function getCart(type){
	myCallAjax('/tickets/user/getCurrentBasket', '', 'GET', getCart_res, 1);
}
function getCart_res(res){
	switch(res.code){
		case 200:
			var cart = res.data.basket;
			$(cart.products).each(function(i){
				var numbers_content = '';
				$(this.ticket_codes).each(function(){
					numbers_content += '<li>'+this+'</li>';
				});
				$('.ticket-wrapper__body').append(`
					<div class="single-row" data-ticket-id="${i}">
						<ul class="numbers">${numbers_content}</ul>
						<h6 class="caption">${this.contest_information.contest_information.code}</h6>
						<div class="action-btns">
							<button type="button" class="del-btn" onclick="deleteTicketFromBasket('${i}','${this.contest_id}', '${this.ticket_codes}')"><i class="las la-trash-alt"></i></button>
						</div>
					</div>
				`);
			});
			$('.total-price').html(cart.basket_price + '<rtr>RTR</rtr>');
			break;
		default:
	}
}

function submitCart(){
	myCallAjax('/tickets/user/submitBasket', '', 'POST', submitCart_res, 1);
}
function submitCart_res(res){
	switch(res.code){
		case 200:
			window.location.replace('./user.html');
			break;
		case 409:
			Swal.fire(res.english_message, '', 'error');
			break;
		default:
	}
}

function deleteTicketFromBasket(num, contest_id, ticket_codes){
	var ticket_codes2 = ticket_codes.split(',');
	ticket_codes2 = ticket_codes2.map(item => {
		return parseInt(item)
	})
	var body = {
		products: [{
			contest_id: contest_id,
			ticket_codes: ticket_codes2,
			quantity: 0
		}],
		num: num
	};
	myCallAjax('/tickets/user/updateProduct', body, 'POST', deleteTicketFromBasket_res, 1);
}
function deleteTicketFromBasket_res(res){
	switch(res.code){
		case 200:
			$('.ticket-wrapper__body [data-ticket-id="'+res.data.input_bundle.num+'"]').remove();
			break;
		default:
	}
}