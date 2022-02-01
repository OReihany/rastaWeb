showMenuItems();
if(!isLogin()){
    window.location.replace('./login.html');
}

checkAdminPermission(page_permission);