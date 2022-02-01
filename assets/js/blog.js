if(page_name == 'list'){
	$(document).ready(function(){
		// getBlogCategories(1, 1000);
		getPosts(1, 1000);
		getLatestPosts(1, 3);
	});
	
	function getBlogCategories(page, count){
        var body = {
			category_name: null,
			parent_id: null,
			page: page,
			count: count
        };
		myCallAjax('/blogcategories/guest/getAll', body, 'POST', getBlogCategories_res, 0);
	}
	function getBlogCategories_res(res){
		switch(res.code){
			case 200:
				var categories = res.data.categories;
				$(categories).each(function(i){
					$('ul.category-list').append(`
                        <li>
                            <a onclick="getPostsByCategory('${this.category_id}')">${this.category_name}</a>
                        </li>
					`);
				});
				break;
			default:
		}
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
		myCallAjax('/blogposts/guest/getAll', body, 'POST', getPosts_res, 0);
	}
	function getPosts_res(res){
		switch(res.code){
			case 200:
				var posts = res.data.posts;
				$(posts).each(function(){
					$('.post-list').append(`
						<div class="blog-card style--two mb-30 has-link">
							<a href="blog-single.html?postId=${this.post_id}" class="item-link"></a>
							<div class="blog-card__thumb"><img src="${this.post_gallery.post_gallery}" alt="image"></div>
							<div class="blog-card__content">
								<h3 class="blog-card__title">${this.post_title}</h3>
								<p>${this.post_brief.post_brief}</p>
								<div class="blog-card__footer">
									<div class="left">
										<span class="post-date">${this.create_date.substr(5, 11)}</span>
									</div>
									<div class="right">
										<span class="post-category">${this.category_id_information.category_name}</span>
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
	
	function getLatestPosts(page, count){
		var body = {
			post_title: null,
			post_tags: null,
			is_promote: null,
			is_active: null,
			page: page,
			count: count
		};
		myCallAjax('/blogposts/guest/getAll', body, 'POST', getLatestPosts_res, 0);
	}
	function getLatestPosts_res(res){
		switch(res.code){
			case 200:
				var posts = res.data.posts;
				$(posts).each(function(){
					$('.small-post-slider').append(`
						<div class="small-post">
							<a href="blog-single.html?postId=${this.post_id}" class="item-link"></a>
							<div class="small-post__thumb"><img src="${this.post_gallery.post_gallery}" alt="image"></div>
							<div class="small-post__content">
								<h3 class="small-post__title">${this.post_title}</h3>
							</div>
						</div>
					`);
				});
				break;
			default:
		}
	}
}
else if(page_name == 'one'){
	$(document).ready(function(){
		getPost();
	});
	
	function getPost(){
		var post_id = getUrlParameter('postId');
		var body = {
			post_id: post_id
		};
		myCallAjax('/blogposts/guest/getOne', body, 'POST', getPost_res, 0);
	}
	function getPost_res(res){
		switch(res.code){
			case 200:
				var post = res.data.post;
				$('.blog-single__title').text(post.post_title + ' - ' + post.post_brief.post_brief);
				$('.post-date').text(post.create_date.substr(5, 11));
				$('.blog-single__body img').attr('src', post.post_gallery.post_gallery);
				$('.blog-single__body .title').text(post.post_title);
				$('.blog-single__body p').text(post.post_description.post_description);
				break;
			default:
		}
	}
}