if(page_type == 'list'){
	$(document).ready(function(){
		getContestCategories();
	});
	
	function getContestCategories(type){
		myCallAjax('/categories/guest/getAll', '', 'POST', getContestCategories_res, 0);
	}
	function getContestCategories_res(res){
		switch(res.code){
			case 200:
				var categories = res.data.categories;
				$(categories).each(function(i){
					var category_classes = '';
					var contest_classes = '';
					if(i==0){
						category_classes = 'active';
						contest_classes = 'show active';
					}
					$('.contest-wrapper .nav-tabs').append(`
						<li class="nav-item" role="presentation">
							<a class="nav-link ${category_classes}" id="${this.category_name}-tab" data-toggle="tab" href="#${this.category_name}" role="tab" aria-controls="${this.category_name}" aria-selected="false">
								<div class="icon-thumb"><img src="${this.category_information.icon}" alt=""></div>
								<span>${this.category_name}</span>
							</a>
						</li>
					`);
					$('.contest-wrapper .tab-content').append(`
						<div class="tab-pane fade ${contest_classes}" id="${this.category_name}" role="tabpanel" aria-labelledby="${this.category_name}-tab">
							<div class="row mb-none-30 mt-50"></div>
						</div>
					`);
					getContests(this.category_id);
				});
				break;
			default:
		}
	}
	
	function getContests(category_id){
		myCallAjax('/contests/guest/getAll?category_id='+category_id, '', 'POST', getContests_res, 0);
	}
	function getContests_res(res){
		switch(res.code){
			case 200:
				var contests = res.data.contests;
				$(contests).each(function(){
					var days_diff = moment(this.end_date, "YYYY-MM-DD").diff(moment.now(), 'day');
					var date = moment(this.end_date, "YYYY-MM-DD").format('YYYY MMMM DD');
					$('.contest-wrapper .tab-content #'+this.category_information.category_name+' > .row').append(`
						<div class="col-xl-4 col-md-6 mb-30">
							<div class="contest-card">
								<a href="contest-details-one.html?contestId=${this.contest_id}" class="item-link"></a>
								<div class="contest-card__thumb">
									<img src="${this.contest_information.icon}" alt="">
									<div class="contest-num">
										<span>contest no:</span>
										<h4 class="number">${this.contest_information.code}</h4>
									</div>
								</div>
								<div class="contest-card__content">
									<div class="left">
										<h5 class="contest-card__name">${this.contest_name}</h5>
									</div>
									<div class="right">
										<span class="contest-card__price">${this.ticket_price}</span>
										<rtr>RTR</rtr>
										<p>ticket price</p>
									</div>
								</div>
								<div class="contest-card__footer">
									<ul class="contest-card__meta">
										<li>
											<i class="las la-clock"></i>
											<span>${days_diff}d</span>
										</li>
										<li>
											<span>${date}</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
					`);
				});
				break;
			default:
		}
	}
}
else if(page_type == 'one'){
	$(document).ready(function(){
		getContest();
	});

	function getContest(category_id){
		var contest_id = getUrlParameter('contestId');
		myCallAjax('/contests/guest/getOne?contest_id='+contest_id, '', 'GET', getContest_res, 0);
	}
	function getContest_res(res){
		switch(res.code){
			case 200:
				var contest = res.data.contest;
				$('.contest-name').text(contest.contest_name);
				$('.contest-num span').text(contest.contest_information.code);
				$('.page-list span').text(contest.contest_information.code);
				$('.ticket-price .amount').html(contest.ticket_price + '<rtr>RTR</rtr>');
				$('.contest-cart__thumb-slider .single-slide img').attr('src', contest.contest_information.icon);
				$('.contest-description #conditions h3').text(contest.conditions.title);
				$('.contest-description #conditions p').html(contest.conditions.desc);
				$('.contest-description #rules h3').text(contest.rules.title);
				$('.contest-description #rules p').html(contest.rules.desc);
				// countdown plungin init
				$('.clock-wrapper .clock').attr('data-clock', moment(contest.end_date, "YYYY-MM-DD").format('YYYY/MM/DD'));
				var getDate = $('.clock').attr('data-clock');
				$('.clock').countdown(getDate, function(event) {
					var days = event.strftime('%D');
					var hours = event.strftime('%H');
					var minutes = event.strftime('%M');
					var seconds = event.strftime('%S');
					$(this).find('.clock-days span').text(days);
					$(this).find('.clock-hours span').text(hours);
					$(this).find('.clock-minutes span').text(minutes);
					$(this).find('.clock-seconds span').text(seconds);
				});
				break;
			default:
		}
	}

	function goToSelectNumbers(){
		var contest_id = getUrlParameter('contestId');
		var ticket_count = $('.select-quantity [name="quantity"]').val();
		window.location.replace('./lottery-details.html?contestId=' + contest_id + '&count=' + ticket_count);
	}
}
else if(page_type == 'add'){
	var ticket_price = 0;
	var tickets_counter = 0;

	$(document).ready(function(){
		getContest();
	});

	function getContest(category_id){
		var contest_id = getUrlParameter('contestId');
		myCallAjax('/contests/guest/getOne?contest_id='+contest_id, '', 'GET', getContest_res, 0);
	}
	function getContest_res(res){
		switch(res.code){
			case 200:
				var contest = res.data.contest;
				addTicketsByCount(contest.contest_information.nums_count, contest.contest_information.nums_range);
				$('.add-ticket-button').attr('onclick', 'addTicket('+contest.contest_information.nums_count+', '+contest.contest_information.nums_range+')');
				$('.page-list span').text(contest.contest_information.code);
				ticket_price = contest.ticket_price;
				$('.price-per').text(ticket_price);
			default:
		}
	}

	function addTicketsByCount(count, range){
		var ticket_count = getUrlParameter('count');
		for(i=0 ; i<ticket_count ; i++){
			setTimeout(() => {
				addTicket(count, range);
			}, 1);
		}
	}
	function addTicket(count, range){
		tickets_counter ++;
		var selected_numbers_content = '';
		for(i=0 ; i<count ; i++){
			selected_numbers_content += '<li>00</li>';
		}
		var numbers_content = '';
		for(i=0 ; i<range ; i++){
			numbers_content += '<li>'+(i+1)+'</li>';
		}
		$('.lottery-wrapper .lottery-list').append(`
			<div class="col-lg-4 mb-30 ticket-col" data-ticket-number="${tickets_counter}">
				<div class="lottery-single">
					<button class="lottery-single__close" onclick="removeTicket('${tickets_counter}')"><i class="las la-times"></i></button>
					<div class="lottery-single__header">
						<span class="titcket-number">Ticket #${tickets_counter}</span>
						<ul class="lottery-single__selected-number" data-ticket-number="${tickets_counter}" data-count="${count}">
							${selected_numbers_content}
						</ul>
					</div>
					<div class="lottery-single__body">
						<ul class="lottery-single__number" data-ticket-number="${tickets_counter}" data-count="${count}">
							${numbers_content}
						</ul>
					</div>
				</div>
			</div>
		`);
		updatePriceBox();
	}
	function removeTicket(ticket_number){
		$('.ticket-col[data-ticket-number="'+ticket_number+'"]').remove();
		updatePriceBox();
	}

	$(document).on('click','.lottery-single__number li', function(e){
		var ticket_number = $(this).parent().attr('data-ticket-number');
		var count = $(this).parent().attr('data-count');
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			var selected_number = $(this).text();
			var actived_li = $('.lottery-single__selected-number[data-ticket-number="'+ticket_number+'"] li').filter(function() {
				return $(this).text() == selected_number;
			});
			$(actived_li).text('00');
			$(actived_li).removeClass('active');
		}
		else{
			if($('.lottery-single__number[data-ticket-number="'+ticket_number+'"] li.active').length < count){
				$(this).addClass('active');
				var first_empty_li = $('.lottery-single__selected-number[data-ticket-number="'+ticket_number+'"] li').not('.active')[0];
				$(first_empty_li).text($(this).text());
				$(first_empty_li).addClass('active');
			}
		} 
	});

	function updatePriceBox(){
		var total_count = $('.ticket-col').length;
		var total_price = total_count*ticket_price;
		$('.price-count').text(total_count);
		$('.price-total').text(total_price);
	}

	function addTicketsToBasket(){
		if(getCookie('rtr-user-token') && getCookie('rtr-user-token')!=''){
			if($('.lottery-single__selected-number li').not('.active').length == 0){
				var contest_id = getUrlParameter('contestId');
				var products = [];
				$('.ticket-col').each(function(i){
					var ticket_codes = [];
					$(this).find('.lottery-single__selected-number li').each(function(){
						ticket_codes.push(parseInt($(this).text()));
					});
					products.push({
						contest_id: contest_id,
						ticket_codes: ticket_codes.sort(function(a, b){
							return a - b;
						}),
						quantity: 1
					});
				});
				var body = {
					products: products
				};
				myCallAjax('/tickets/user/updateProduct', body, 'POST', addTicketsToBasket_res, 1);
			}
			else{
				Swal.fire('Select All Numbers !', '', 'error');
			}
		}
		else{
			$('#loginModal').modal('show');
		}
	}
	function addTicketsToBasket_res(res){
		switch(res.code){
			case 200:
				window.location.replace('./cart.html');
				break;
			default:
		}
	}
}