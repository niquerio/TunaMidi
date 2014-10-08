define([],function(){
    var protocol = window.location.protocol;
    var host = window.location.host;
    var pathArray = window.location.pathname.split( '/' );
    pathArray.pop();
    var path = protocol + '//' + host;
    for ( var i = 0; i < pathArray.length; i++ ) {
        path = path + pathArray[i] + '/';
    }
    return path
});
