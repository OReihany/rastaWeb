$(document).ready(function(){
	getFAQs();
});

function getFAQs(category_id){
	myCallAjax('/faqs/guest/getAll', '', 'GET', getFAQs_res, 0);
}
function getFAQs_res(res){
	switch(res.code){
		case 200:
			var faqs = res.data.categories;
			$(faqs).each(function(i){
				var name = this.category_name;
				var id = this.category_id;
				var list = this.questions;
				var category_classes = '';
				var list_classes = '';
				if(i==0){
					category_classes = 'active';
					list_classes = 'show active';
				}
				$('.faq-top-wrapper .nav-tabs').append(`
					<li class="nav-item" role="presentation">
						<a class="nav-link ${category_classes}" id="id-${id}-tab" data-toggle="tab" href="#id-${id}" role="tab" aria-controls="id-${id}" aria-selected="false">${name}</a>
					</li>
				`);
				var list_content = '';
				$(list).each(function(i){
					list_content += `
						<div class="card">
							<div class="card-header" id="id-${id}-${i}">
								<button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#id-${id}-collapse-${i}" aria-expanded="false" aria-controls="id-${id}-collapse-${i}">
									${this.question}
								</button>
							</div>
							<div id="id-${id}-collapse-${i}" class="collapse" aria-labelledby="id-${id}-${i}" data-parent="#id-${id}-list">
								<div class="card-body">
								<p>${this.answer}</p>
								</div>
							</div>
						</div>
					`;
				});
				$('.faq-body-wrapper .tab-content').append(`
					<div class="tab-pane fade ${list_classes}" id="id-${id}" role="tabpanel" aria-labelledby="id-${id}-tab">
						<div class="accordion cmn-accordion" id="id-${id}-list">${list_content}</div>
					</div>
				`);
			});
			break;
		default:
	}
}

function getUsersComments(){
	myCallAjax('/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', '', 'GET', getUsersComments_res, 0);
}
function getUsersComments_res(res){
	switch(res.code){
		case 200:
			var comments = res.data.comments;
			$(comments).each(function(){
				$('.testimonial-area .testimonial-slider').append(`
					<div class="testimonial-single">
						<div class="testimonial-single__content">
							<h4 class="client-name">${this.name}</h4>
							<p>“${this.desc}”</p>
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