"use strict";
var sys = require("system"),
    page = require("webpage").create();

var loginUrl = "https://my.kandianbao.com/user/login/";
var searchUrl = 'https://so.kandianbao.com/%E7%B2%BE%E6%B2%B9/1/';
// var tmallUrl = "https://detail.tmall.com/item.htm?id=523158577889&ali_refid=a3_430583_1006:1110276036:N:%E7%B2%BE%E6%B2%B9:eac891f3b9190c27312ae0c636bffd81&ali_trackid=1_eac891f3b9190c27312ae0c636bffd81&spm=a230r.1.14.1";
// var tmallUrl = "http://en.wikipedia.org/wiki/DOM_events";

// var cookies = [
//     {
//         'domain':'g.alicdn.com',
//         'path':'/alilog/oneplus',
//         'name': '_umdata',
//         'value':'C234BF9D3AFA6FE7493AF1703405CEA0273B46BBCA0265CB3F6468A86E6485A9550CC99E02EA0356CD43AD3E795C914CB9991D238CD8F0D583CB77FBB5BDDB6C',
//     },
//     {
//         'domain':'g.alicdn.com',
//         'path':'/',
//         'name': '_umdata',
//         'value':'C234BF9D3AFA6FE7493AF1703405CEA0273B46BBCA0265CB3F6468A86E6485A9550CC99E02EA0356CD43AD3E795C914C59FC1242FEEB67A57180D10428D89CDA',
//     },
//     {
//         'domain':'g.alicdn.com',
//         'path':'/alilog/oneplus',
//         'name': '_lastvisited',
//         'value': 'SuaOERJNsBkCAWomTNITJ4L%2F%2C%2CSuaOERJNsBkCAWomTNITJ4LJBYMr2eZf%2Cjg35xhb6%2Cjg35xhb6%2C3%2C0e149bcc%2CSuaOERJNsBkCAWomTNITJ4L%2F%2Cjg3e00yz',
//     }
    
// ];
// cookies.forEach(function(c){
//     phantom.addCookie(c);
// });

function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
}

page.onLoadFinished = function(){
    console.log("page.onLoadFinished");
    printArgs.apply(this, arguments);
};
page.onResourceError = function(resourceError) {
    console.log('Unable to load resource (#' + resourceError.id + 'URL:' + resourceError.url + ')');
    console.log('Error code: ' + resourceError.errorCode + '. Description: ' + resourceError.errorString);
};
page.onResourceRequested = function(requestData, networkRequest) {
    if (/alicdn|tmall/.test(requestData.url)) {
        // console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
    }
};
page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

page.onInitialized = function() {
    page.customHeaders = {
        // cookie: 'session=a070cdd4-b62f-41c4-97f1-19df1a104ea6; Hm_lvt_3557e63a0ec40db6a00059036092dbae=1524461022; session2=35bae00d9a374b3c0fdeae73b6f19746; invite=isuser; Hm_lpvt_3557e63a0ec40db6a00059036092dbae=1524463698',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
        // referer: 'https://s.taobao.com/search?q=%E7%B2%BE%E6%B2%B9&imgfile=&commend=all&ssid=s5-e&search_type=item&sourceId=tb.index&spm=a21bo.2017.201856-taobao-item.1&ie=utf8&initiative_id=tbindexz_20170306',
        // ':authority': 'detail.tmall.com',
        // ':path': '/item.htm?spm=a230r.1.14.13.70816207zTnfol&id=523158577889&cm_id=140105335569ed55e27b&abbucket=13'
    };
};

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

page.onUrlChanged = function(targetUrl) {
    console.log('New URL: ' + targetUrl);
  };

page.open(loginUrl, function(status){
    if (status !== 'success') {
        console.log('Unable to access network.');
        page.render('login.png');
        phantom.exit(1);
        return;
    }

    // page.open(searchUrl, function(status){
    //     if (status !== 'success') {
    //         console.log('Unable to access network.');
    //         page.render('search.png');
    //         phantom.exit(1);
    //         return;
    //     }
    //     page.render('search.png');
    //     phantom.exit(1);
    // });
});

