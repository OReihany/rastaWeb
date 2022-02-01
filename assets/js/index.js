$(document).ready(function () {
    getMostViewedProducts();
    getBlogPosts();
    getUsersComments();
});

function getMostViewedProducts() {
    myCallAjax('/products/guest/getAll?category_id=-1&product_name=&page=1&count=8', '', 'GET', getMostViewedProducts_res, 0);
}

function getMostViewedProducts_res(res) {
    if (res) {
        if (res.code === 200) {
            let products = res.data.products;
            let products_html = '';
            products.forEach((item, index) => {
                products_html += `<div class="col-lg-4 col-md-6 col-sm-12 col-xs-12" data-id="${index}">
                    <div class="imagebox-courses-type1">
                        <div class="featured-post">
                            <img src="${item.product_information.icon || '../images/home4/1.png'}" alt="product">
                        </div>
                        <div class="author-info">
                            <div class="avatar">
                                <img src="images/home1/11.png" alt="images">
                            </div>
                            <div class="category">
                            ${item.category_information.category_name}
                            </div>
                            <div class="name">
                                <a href="#">${item.product_name}</a>
                            </div>
                            <div class="border-bt">
                            </div>
                            <div class="evaluate">
                                <div class="price">
                                    <span class="price-now" >${commafy(item.product_price)}</span>
                           ${(parseInt(item.product_price) === parseInt(item.product_price_after_discount)) ?
                    '' :
                    `<span className="price-previou"><del>${commafy(parseInt(item.product_price_after_discount))}</del></span>`
                }
                                </div>
                                <div class="review">
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
                                    <i class="fa fa-star" aria-hidden="true"></i>
<!--                                    <span>(86)</span>-->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
            });
            let main_tag = document.querySelectorAll('.online-courses-wrap .row')[0]
            main_tag.innerHTML = products_html;
        } else {
            Swal.fire(res.english_message, '', 'error');
        }
    } else {
        Swal.fire(res.english_message, '', 'error');
    }
}

function getBlogPosts() {
    let body = {
        "post_title": null,
        "post_tags": null,
        "is_promote": null,
        "is_active": 1,
        "page": 1,
        "count": 8
    };
    myCallAjax('/blogposts/guest/getAll', body, 'POST', getBlogPosts_res, 0);
}

function getBlogPosts_res(res) {
    if (res) {
        if (res.code === 200) {
            let posts = res.data.posts;
            let owl_tag = document.getElementById('last-news').getElementsByClassName('owl-item');
            posts.forEach((item, index) => {
                if (index < 7)
                    owl_tag[index].innerHTML = `<article class="post post-style1 post-bg" data-index="${index}">
                    <div class="bg clearfix">
                        <div class="position cl-fbb545 lt-sp4">
                            ${item.category_id_information.category_name}
                        </div>
                        <div class="featured-post">
                            <img src="${item.post_gallery.url}" alt="News">
                        </div>
                    </div>
                    <div class="post-content clearfix">
                        <div class="entry-info cleafix">
                            <div class="post-title">
                                <h5>
                                    <a href="#" class="lt-sp04">${item.post_title}</a>
                                </h5>
                            </div>
                        </div>
                        <div class="post-link">
                            <a href="#">بیشتر</a>
                        </div>
                    </div>
                </article>`
                else
                    '';
            });
        } else {
            Swal.fire(res.english_message, '', 'error');
        }
    } else {
        Swal.fire(res.english_message, '', 'error');
    }
}

function getUsersComments() {
    let body = {
        "testimonial_name": "",
        "page": 1,
        "count": 10
    };
    myCallAjax('/testimonials/guest/getAll', body, 'POST', getUsersComments_res, 0);
}

function getUsersComments_res(res) {
    if (res) {
        if (res.code === 200) {
            let comments = res.data.testimonials;
            let comment_tag = document.querySelectorAll('#comments li');
            console.log(comments.length);
            comments.forEach((item, index) => {
                if (index < comments.length){
                    comment_tag[index].innerHTML = `
                <span class="icon-quote icon-icons8-get-quote-filled-100"></span>
                        <p class="speech">
                            ${item.other_information.message}
                        </p>
                        <div class="name">
                            ${item.testimonial_name}
                        </div>
                        <div class="job">
                            ${item.other_information.title}
                        </div>
                `;
                }else {
                    comment_tag[index].innerHTML = '';
                }
            })

        } else {
            Swal.fire(res.english_message, '', 'error');
        }
    } else {
        Swal.fire(res.english_message, '', 'error');
    }
}