// ajax
var baseUrl = 'http://49.12.98.134:8081';
function myCallAjax(api, body, method, functionEnter, needToken, page) {
	var header;
	if (needToken) {
		header = {
			'Content-Type': 'application/json',
			'Token': getCookie('rasta-admin-token')
		}
	}
	else {
		header = {
			'Content-Type': 'application/json'
		}
	}
	if( method === 'POST' || method === 'PUT'){
		var voidmain = 5;
	}
	if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
		var finalBody = JSON.stringify(body);
		$.ajax({
			url: baseUrl + api,
			headers: header,
			type: method,
			data: finalBody,
			success: function (data) {
				console.log(' api>>> ',api);
				console.log('request: ', body);
				console.log('response: ', data);
				if (page !== '') {
					//give page to render table
					functionEnter(data, page);
				}
				else {
					functionEnter(data);
				}
			},
			error: function (data) {
				console.log(' api>>> ',api);
				console.log(data);
				errorHandling(data.status, functionEnter);
			}
		});
	}
	else if (method === 'GET') {

		$.ajax({
			url: baseUrl + api,
			headers: header,
			type: method,
			success: function (data) {
				console.log(' api>>> ',api);
				console.log(data);
				if (page) {
					functionEnter(data, page);
				}
				else {
					functionEnter(data);
				}
			},
			error: function (data) {
				console.log(data);
				console.log(' api>>> ',api);
				errorHandling(data.status);
			}
		});
	}
}
function myCallAjaxByConfirm(api, body, method, functionEnter, needToken, type){
	switch(type){
		case 'add':
			title = 'تغییرات ذخیره شوند؟';
			icon = 'info';
			break;
		case 'delete':
			title = 'حذف شود؟';
			icon = 'warning';
			break;
	}
	Swal.fire({
		title: title,
		icon: icon,
		showCancelButton: true,
		confirmButtonText: 'ذخیره',
		cancelButtonText: 'لغو',
	}).then((result) => {
		if (result.isConfirmed) {
			myCallAjax(api, body, method, functionEnter, needToken);
		} else if (result.isDenied) {
		}
	});
}

// url parameters
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
function removeUrlParameter(paramName){
	var params = window.location.search.substring(1).split('&');
	var newParams = [];
	$(params).each(function(){
		var label = this.split('=')[0];
		if(label != paramName){
			newParams.push(this);
		}
	});
	newParams = newParams.join('&');
	var lastUrlPart = window.location.pathname.split('/').reverse()[0];
	var newUrl = window.location.pathname + '?' + newParams;
	window.history.pushState({},"", lastUrlPart + '?' + newParams);
}
function updateUrlParameter(paramName, NewValue){
	var params = window.location.search.substring(1).split('&');
	var newParams = [];
	$(params).each(function(){
		var label = this.split('=')[0];
		if(label != paramName){
			newParams.push(this);
		}
		else{
			newParams.push(paramName + '=' + NewValue);
		}
	});
	if(getUrlParameter(paramName) == undefined){
		newParams.push(paramName + '=' + NewValue);
	}
	newParams = newParams.join('&');
	var lastUrlPart = window.location.pathname.split('/').reverse()[0];
	var newUrl = window.location.pathname + '?' + newParams;
	window.history.pushState({},"", lastUrlPart + '?' + newParams);
}

// storage
function setCookie(cName, cValue, exMonths) {
	var date = new Date();
	date.setTime(date.getTime() + (exMonths * 30 * 24 * 60 * 60 * 1000));
	var expires = "expires=" + date.toUTCString();
	document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}
function getCookie(cName) {
	var name = cName + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

//
$.fn.digits = function () {
	return this.each(function () {
		$(this).text($(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"));
	})
};

// checked url correctly
function getPageName() {
    var href = document.location.href;
    return href.substr(href.lastIndexOf('/') + 1);
}

$(document).ready(function(){
    // checkedUserLogin();

});
var flagFirstGetProfile = true;
function checkedUserLogin() {
	// console.log(getCookie('UT-Viarashop'));
    if (getCookie('UT-Viarashop')) {
		console.log(flagFirstGetProfile);
		if (flagFirstGetProfile) {
			$('.profile-box').find('.phone').text(getCookie('UM-Viarashop'));
			// getProfile();
		}
		return true;
    } else {
        var pageName = getPageName();
        if (
        	// pageName.indexOf('profile.html') > -1 ||
            pageName.indexOf('pay.html') > -1 ||
            // pageName.indexOf('checkout.html') > -1 ||
            pageName.indexOf('order-information.html') > -1) {
            window.location.href = '../../index-2.html';// when upload site set this value to return home page '/';
        }
        else {
			return false;
		}
    }
}

function logOut() {
	setCookie('basket_count','');
	setCookie('basket_items','');
	setCookie('basket_existance','');
	setCookie('basket_id','');
	setCookie('UT-Viarashop','');
	setCookie('UID-Viarashop','');
	setCookie('UM-Viarashop','');
	setCookie('UP-Viarashop','');
	if(getPageName().indexOf('profile.html') === 0 || getPageName().indexOf('checkout.html') === 0){
		// window.location.href = "../../index-2.html";
		// window.location.href = "/";
	}
	else {
		location.reload();
	}
	// localStorage.removeItem('_User_Profile');
}
//pagination function global

function newPaginate(all_of_any, count, selector_class, functionEnter, use_count){
	if(all_of_any == 0){
		$('.pagination').hide();
	}
	else{
		$('.pagination').show();
		var numOfPage = Math.ceil(all_of_any / count);
		var element = $('.' + selector_class).find('.box-paginate');
		var firstPageClick = false;
		$('.row-paginate').show();
		var defaultOpts = {
			totalPages: numOfPage,
			visiblePages: 7,
			onPageClick: function (evt, page) {
				if (firstPageClick) {
					if (use_count){
						functionEnter(page , count);
					}
					else {
						functionEnter(page);
					}
				}
				firstPageClick = true;
			},
			first: '<i class="fa fa-chevron-right"></i>',//<i class="fa fa-step-forward"></i>
			prev: '',//<i class="fa fa-chevron-right"></i>
			next: '',//<i class="fa fa-chevron-left"></i>
			last: '<i class="fa fa-chevron-left"></i>' //<i class="fa fa-step-backward"></i>
		};
		$(element).find('.title-of-pagination numberofpage').text(numOfPage);
		if (!firstPageClick) {
			var currentPage = $(element).find('ul').twbsPagination('getCurrentPage');
			if (currentPage > numOfPage) {
				currentPage = numOfPage;
			}
			$(element).find('ul').twbsPagination('destroy');
			$(element).find('ul').twbsPagination(
				$.extend({}, defaultOpts, {
					startPage: currentPage,
					totalPages: numOfPage
				})
			);
		} else {
			$(element).find('ul').twbsPagination(defaultOpts);
		}
	}
}

//Error handling
function errorHandling(error_cod) {
	switch (error_cod) {
		case 401:
			logOut();
			// refreshToken();
			break;
		default :
			console.log('error');
			break;
	}

}
function refreshToken() {
	var oldToken = getCookie('UT-Viarashop'),
		body = {token: oldToken};
	console.log(body);
	myCallAjax('/auth/refresh_token',body,'POST',resultRefreshToken,1);
}

function resultRefreshToken(response) {
	setCookie('UT-Viarashop',response.token,1);
}

////////////////////////////////

function isLogin(){
	var token = getCookie('rasta-admin-token');
    if(token != '')
		return true;
    return false;
}

function checkAdminPermission(permission){
	myCallAjax('/admins/admin/check?permission='+permission, '', 'GET', checkAdminPermission_res, 1);
}
function checkAdminPermission_res(res){
	if(res){
		if(res.code==200){
			setProfileDetail();
			runPageFunctions();
		}
		else{
			if(page_permission == 'Self')
				window.location.replace('./login.html');
			else
				window.location.replace('./index.html');
		}
	}
	else{
		alert('مشکلی در دریافت اطلاعات پیش آمده است');
	}
}

function setProfileDetail(){
    var username = getCookie('rasta-admin-username');
    $('.profile .profile_info h2').text(username);
    $('.user-profile img').after(username);
}

function showMenuItems(){
	var permissions = getCookie('rasta-admin-permissions');
	if(permissions.includes('Category')){
		$('.main-ul').append(`
			<li><a>دسته بندی ها<span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">
					<li class="sub_menu"><a href="categories.html">لیست</a></li>
					<li class="sub_menu"><a href="category-add.html">افزودن</a></li>
				</ul>
			</li>
		`);
	}
	if(permissions.includes('Product')){
		$('.main-ul').append(`
			<li><a>محصولات<span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">
					<li class="sub_menu"><a href="products.html">لیست</a></li>
					<li class="sub_menu"><a href="product-add.html">افزودن</a></li>
				</ul>
			</li>
		`);
	}
	if(permissions.includes('Brand')){
		$('.main-ul').append(`
			<li><a>برند ها<span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">
					<li class="sub_menu"><a href="brands.html">لیست</a></li>
					<li class="sub_menu"><a href="brand-add.html">افزودن</a></li>
				</ul>
			</li>
		`);
	}
	if(permissions.includes('Banner')){
		$('.main-ul').append(`
			<li><a>بنر ها<span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">
					<li class="sub_menu"><a href="banners.html">لیست</a></li>
					<li class="sub_menu"><a href="banner-add.html">افزودن</a></li>
				</ul>
			</li>
		`);
	}
	if(permissions.includes('User')){
		$('.main-ul').append(`
			<li><a href="users.html">کاربران</a></li>
		`);
	}
	if(permissions.includes('Testimonial')){
		$('.main-ul').append(`
			<li><a>نظرات<span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">
					<li class="sub_menu"><a href="comments.html">لیست</a></li>
					<li class="sub_menu"><a href="comment-add.html">افزودن</a></li>
				</ul>
			</li>
		`);
	}
	if(permissions.includes('Email')){
		$('.main-ul').append(`
			<li><a href="emails.html">ایمیل ها</a></li>
		`);
	}
	if(permissions.includes('Transaction')){
		$('.main-ul').append(`
			<li><a href="transactions.html">تراکنش ها</a></li>
		`);
	}
	if(permissions.includes('Setting')){
		$('.main-ul').append(`
			<li><a href="setting-general.html">اطلاعات سراسری</a></li>
		`);
	}
	if(permissions.includes('Faq')){
		$('.main-ul').append(`
			<li><a>سوالات متداول<span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">
					<li class="sub_menu"><a href="faqs.html">لیست</a></li>
					<li class="sub_menu"><a href="faq-add.html">افزودن</a></li>
				</ul>
			</li>
		`);
	}
	if(permissions.includes('Admin')){
		$('.main-ul').append(`
			<li><a>ادمین ها<span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">
					<li class="sub_menu"><a href="admins.html">لیست</a></li>
					<li class="sub_menu"><a href="admin-add.html">افزودن</a></li>
				</ul>
			</li>
		`);
	}
	if(permissions.includes('BlogPost') || permissions.includes('BlogCategories')){
		var blog_menu_content = `
			<li><a>بلاگ <span class="fa fa-chevron-down"></span></a>
				<ul class="nav child_menu">`;
		if(permissions.includes('BlogCategories')){
			blog_menu_content += `
				<li class="sub_menu">
					<a>دسته بندی ها <span class="fa fa-chevron-down"></span></a>
					<ul class="nav child_menu">
						<li class="sub_menu"><a href="blog-categories.html">لیست</a></li>
						<li class="sub_menu"><a href="blog-category-add.html">افزودن</a></li>
					</ul>
				</li>`;
		}
		if(permissions.includes('BlogPost')){
			blog_menu_content += `
				<li class="sub_menu">
					<a>پست ها <span class="fa fa-chevron-down"></span></a>
					<ul class="nav child_menu">
						<li class="sub_menu"><a href="blog-posts.html">لیست</a></li>
						<li class="sub_menu"><a href="blog-post-add.html">افزودن</a></li>
					</ul>
				</li>`;
		}
		blog_menu_content += `
				</ul>
			</li>`;
		$('.main-ul').append(blog_menu_content);
	}
}

function uploadMedia(input, returnFunction){
	var file = input.files[0];
	// var extension = $(input).val().split('.').pop();
	var Data = new FormData();
	Data.append("file", file);
	Data.append("upload_file", true);
	$.ajax({
		url: baseUrl + "/upload",
		headers: {
			'Token': getCookie('rasta-admin-token')
		},
		type: 'POST',
		data: Data,
		contentType: false,
		cache: false,
		processData: false,
		async: true,
		success: function (data){
			returnFunction(data);
		},
		error: function (data){
			returnFunction(data);
		}
	});
	// myCallAjax('/upload', body, 'POST', returnFunction, 1);
}
