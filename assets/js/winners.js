$(document).ready(function(){
	getBiggestWinner();
	getContestCategories();
	getUsersComments();
});

function getBiggestWinner(){
	myCallAjax('/tickets/guest/getBiggest', '', 'GET', getBiggestWinner_res, 0);
}
function getBiggestWinner_res(res){
	switch(res.code){
		case 200:
			var biggest = res.data.ticket;
			$('.winner-details-wrapper .contest-number span').text(biggest.contest_information.contest_information.code);
			$('.winner-details-wrapper .contest-date span.date').text(biggest.contest_information.end_date.substr(0,10));
			var numbers_content = '';
			$(biggest.ticket_codes).each(function(){
				numbers_content += '<li>'+this+'</li>';
			});
			$('.winner-details-wrapper .numbers').html(numbers_content);
			break;
		default:
	}
}

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
				$('.latest-winner-section .nav-tabs').append(`
					<li class="nav-item" role="presentation">
						<a class="nav-link ${category_classes}" id="${this.category_name}-tab" data-toggle="tab" href="#${this.category_name}" role="tab" aria-controls="${this.category_name}" aria-selected="false">
							<div class="icon-thumb"><img src="${this.category_information.icon}"></div>
							<span>${this.category_name}</span>
						</a>
					</li>
				`);
				$('.latest-winner-section .tab-content').append(`
					<div class="tab-pane fade ${contest_classes}" id="${this.category_name}" role="tabpanel" aria-labelledby="${this.category_name}-tab">
						<div class="row mb-none-30"></div>
					</div>
				`);
				getWinners(this.category_id);
			});
			break;
		default:
	}
}

function getWinners(category_id){
	myCallAjax('/tickets/guest/getWinners?category_id='+category_id, '', 'GET', getWinners_res, 0);
}
function getWinners_res(res){
	switch(res.code){
		case 200:
			var winners = res.data.tickets;
			$(winners).each(function(){
				var date = moment(this.contest_information.end_date, "YYYY-MM-DD").format('YYYY MMMM DD');
				var numbers_content = '';
				$(this.ticket_codes).each(function(){
					numbers_content += '<li>'+this+'</li>';
				});
				var user_avatar = './assets/images/user/pp.png';
				if(this.user_information.avatar){
					user_avatar = avatar;
				}

				$('.latest-winner-section .tab-content #'+this.category_information.category_name+' > .row').append(`
				 	<div class="col-sm-12 mb-30">
				 		<div class="winner-card mb-30">
				 			<div class="winner-card__thumb">
				 				<img src="${this.contest_information.contest_information.icon}">
				 			</div>
				 			<div class="winner-card__content">
				 				<div class="winner-thumb"><img src="${user_avatar}"></div>
				 				<div class="content-top">
				 					<div class="left">
				 						<h5>${this.user_information.invite_code}</h5>
				 					</div>
				 					<div class="right">
				 						<span>Draw took place on</span>
				 						<p>${date}</p>
				 					</div>
				 				</div>
				 				<div class="content-bottom">
				 					<div class="number-list-wrapper">
				 						<p>Winning Numbers:</p>
				 						<ul class="number-list mt-2">${numbers_content}</ul>
				 					</div>
				 					<div class="right">
				 						<p>Contest No:</p>
				 						<span class="contest-num">${this.contest_information.contest_information.code}</span>
				 					</div>
				 				</div>
				 			</div>
				 		</div>
				 	</div>
				`);
			});
			break;
		default:
	}
}

function getUsersComments(){
	myCallAjax('/reviews/guest/getAll', '', 'GET', getUsersComments_res, 0);
}
function getUsersComments_res(res){
	switch(res.code){
		case 200:
			var comments = res.data.reviews;
			$(comments).each(function(){
				$('.testimonial-area .testimonial-slider').append(`
					<div class="testimonial-single">
						<div class="testimonial-single__content">
							<h4 class="client-name">${this.reviewer_name}</h4>
							<p>“${this.review_message}”</p>
							<div class="ratings">
								<i class="fas fa-star"></i>
								<i class="fas fa-star"></i>
								<i class="fas fa-star"></i>
								<i class="fas fa-star"></i>
								<i class="fas fa-star"></i>
							</div>
						</div>
					</div>
				`);
			});
			runCommentsSlider();
			break;
		default:
	}
}
function runCommentsSlider(){
    $('.testimonial-slider').slick({
		autoplay: true,
		speed: 700,
		arrows: true,
		dots: false,
		arrows: false,
		vertical: true,
		verticalSwiping: true,
	  });
}