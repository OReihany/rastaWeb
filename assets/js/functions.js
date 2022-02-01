// server info
var baseUrl = 'http://49.12.98.134:8081';
// var baseUrl = 'http://172.20.10.3:8080';

function myCallAjax(api, body, method, functionEnter, needToken, page){
	var header;
	if(needToken){
		header = {
			'Content-Type': 'application/json',
			'token': getCookie('rtr-user-token')
		}
	}
	else{
		header = {
			'Content-Type': 'application/json'
		}
	}
	if(method === 'POST' || method === 'PUT' || method === 'DELETE'){
		var finalBody = JSON.stringify(body);
		$.ajax({
			url: baseUrl + api,
			headers: header,
			type: method,
			data: finalBody,
			success: function (data) {
				console.log('api:', method, api);
				console.log('request:', body);
				console.log('response:', data);
				functionEnter(data);
			},
			error: function (data){
				console.log('response: (error)', data);
				// functionEnter(data, 'success');
			}
		});
	}
	else if(method === 'GET'){

		$.ajax({
			url: baseUrl + api,
			headers: header,
			type: method,
			success: function (data) {
				console.log('api:', method, api);
				console.log('request:', body);
				console.log('response:', data);
				functionEnter(data);
			},
			error: function (data){
				console.log('response: (error)', data);
				// functionEnter(data, 'success');
			}
		});
	}
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
		if(label !== paramName){
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
		if(label !== paramName){
			newParams.push(this);
		}
		else{
			newParams.push(paramName + '=' + NewValue);
		}
	});
	if(getUrlParameter(paramName) === undefined){
		newParams.push(paramName + '=' + NewValue);
	}
	newParams = newParams.join('&');
	var lastUrlPart = window.location.pathname.split('/').reverse()[0];
	var newUrl = window.location.pathname + '?' + newParams;
	window.history.pushState({},"", lastUrlPart + '?' + newParams);
}
$('.language select').on('change', function(){
	var lang = $(this).val();
	updateUrlParameter('lang', lang);
	window.location.reload();
});

// cookie storage
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

// add separator to digits
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

// local storage
function setLS(key, val){
	window.localStorage.setItem(key, val);
}
function getLS(key){
	let val = window.localStorage.getItem(key);
	return val;
}
function removeLS(key){
	window.localStorage.removeItem(key);
}
function clearLS(){
	window.localStorage.clear();
}

commafy = ( num ) => {
	var str = num.toString().split('.');
	if (str[0].length >= 5) {
		str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	}
	if (str[1] && str[1].length >= 5) {
		str[1] = str[1].replace(/(\d{3})/g, '$1 ');
	}
	return str.join('.');
}