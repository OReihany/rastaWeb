function runPageFunctions(){
    getGeneralInfo();
}

function getGeneralInfo(){
    myCallAjax('/admins/guest/getSettings', '', 'GET', getGeneralInfo_res, 0);
}
function getGeneralInfo_res(res){
    switch(res.code){
        case 200:
            var info = res.data.settings_information;
            $('#item-form [name="youtube"]').val(info.youtube);
            $('#item-form [name="email"]').val(info.email);
            $('#item-form [name="phone"]').val(info.phone);
            $('#item-form [name="address"]').val(info.address);
            $('#item-form [name="address-fa"]').val(info.address_fa);
            $('#item-form [name="telegram"]').val(info.social.telegram);
            $('#item-form [name="instagram"]').val(info.social.instagram);
            $('#item-form [name="followers-facebook"]').val(info.followers.facebook);
            $('#item-form [name="followers-twitter"]').val(info.followers.twitter);
            $('#item-form [name="followers-members"]').val(info.followers.members);
            $('#item-form [name="followers-subscribers"]').val(info.followers.subscribers);
            $('#item-form [name="deposit-text"]').val(info.deposit_text);
            $('#item-form [name="deposit-text-fa"]').val(info.deposit_text_fa);
            break;
        default:
            Swal.fire('خطا', '', 'error');
    }
}

function updateGeneralInfo(){
    var youtube = $('#item-form [name="youtube"]').val();
    var email = $('#item-form [name="email"]').val();
    var phone = $('#item-form [name="phone"]').val();
    var address = $('#item-form [name="address"]').val();
    var address_fa = $('#item-form [name="address-fa"]').val();
    var telegram = $('#item-form [name="telegram"]').val();
    var instagram = $('#item-form [name="instagram"]').val();
    var social = {
        telegram: telegram,
        instagram: instagram
    };
    var followers_facebook = $('#item-form [name="followers-facebook"]').val();
    var followers_twitter = $('#item-form [name="followers-twitter"]').val();
    var followers_members = $('#item-form [name="followers-members"]').val();
    var followers_subscribers = $('#item-form [name="followers-subscribers"]').val();
    var deposit_text = $('#item-form [name="deposit-text"]').val();
    var deposit_text_fa = $('#item-form [name="deposit-text-fa"]').val();
    var body = {
        settings_information: {
            youtube: youtube,
            email: email,
            phone: phone,
            address: address,
            address_fa: address_fa,
            social: social,
            followers: {
                facebook: followers_facebook,
                twitter: followers_twitter,
                members: followers_members,
                subscribers: followers_subscribers
            },
            deposit_text_fa: deposit_text_fa,
            deposit_text: deposit_text
        }
    };
    myCallAjaxByConfirm('/admins/admin/setSettings', body, 'POST', updateGeneralInfo_res, 1, 'add');
}
function updateGeneralInfo_res(res){
    switch(res.code){
        case 200:
            Swal.fire(res.farsi_message, '', 'success');
            break;
        default:
            Swal.fire(res.farsi_message, '', 'error');
    }
}
