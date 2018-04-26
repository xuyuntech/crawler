"use strict";
var sys = require("system"),
    page = require("webpage").create();

// var tmallUrl = "https://s.taobao.com/search?q=%E7%B2%BE%E6%B2%B9&imgfile=&commend=all&ssid=s5-e&search_type=item&sourceId=tb.index&spm=a21bo.2017.201856-taobao-item.1&ie=utf8&initiative_id=tbindexz_20170306";
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
        // cookie: 'cookie2=150d297914bc740474bf1c8add825e0f; _tb_token_=f8b819e37b577; cna=SuaOERJNsBkCAWomTNITJ4L/; tk_trace=1; cq=ccp%3D1; dnk=c330785652; uc3=nk2=ACk3q%2BlJy1FZ9A%3D%3D&id2=WvA21Gl9O%2BFu&vt3=F8dBz4D8p9r7verUb4U%3D&lg2=URm48syIIVrSKA%3D%3D; tracknick=c330785652; lgc=c330785652; t=105f1853ce9dfc8d28e419f54e28c1b8; csg=03c25d78; enc=XtKrs5PG5LSHRhj5jKRI6%2BH0pXgVIG%2Bp%2B0wPj%2FoAgshs2OoApqCWXaEUIWyNf4C6HUvuBwzhXBTL8jtj1xvPwg%3D%3D; sm4=110105; _m_h5_tk=15b11f3edef51e0a2ebda3b3cac1661d_1523947271494; _m_h5_tk_enc=c52d8773a4e6d01265b9f8871dbb03d6; hng=CN%7Czh-CN%7CCNY%7C156; uc1=cookie16=WqG3DMC9UpAPBHGz5QBErFxlCA%3D%3D&cookie21=WqG3DMC9FxUx&cookie15=URm48syIIVrSKA%3D%3D&existShop=false&pas=0&cookie14=UoTePTwdVWh1ig%3D%3D&tag=8&lng=zh_CN; pnm_cku822=098%23E1hva9vUvbpvUQCkvvvvvjiPPFMyljDWR2L9gjthPmPvQjiUnLM90jYPR2cWgjtbn2FOiQhvCvvv9UUPvpvhvvvvvvhCvvOvCvvvphvEvpCWmn2tvvazlw03IEk4ahfUQWFwDCOrvGjxs4hZeVDHrfFClfy64Hey%2BExrV4tYZWoQA4mXH5EJD7zUaXp7EcqUaNolHs9ScTmy%2BE7reOyCvvOUvvVCayRivpvUvvmvWXU6GxktvpvIMMMMabYvtQUvvUnvphvWcQvv96CvpC29vvm2phCvhRvvvUnvphvpg2yCvvpvvvvv; isg=BMPDMxCunf8qVFKyT38UpxhQUoGtkFYer2PVcPWgOCKZtOPWfgjnyqEOKkT6FK9y',
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

page.open(tmallUrl, function(status){
    if (status !== 'success') {
        console.log('Unable to access network.');
        page.render('tmall.png');
        phantom.exit(1);
        return;
    }

    page.includeJs('http://libs.baidu.com/jquery/1.9.1/jquery.min.js', function(){
        (
            waitFor(function(){
                console.log('===> page.evaluate');
                return page.evaluate(function(){
                    return $('#mainsrp-itemlist').length > 0;
                })
            }, function(){
                var detailUrl = page.evaluate(function(){
                    var $item = $('#mainsrp-itemlist').find('.items:first-child').find('.item:first-child');
                    console.log('>>>',$item.length,  $item.find('a.pic-link').attr('href'));
                    var $a = $item.find('a.pic-link');
                    var detailUrl = $item.find('a.pic-link').attr('href');
                    return detailUrl;//$a.offset();
                })
                // console.log('offset', JSON.stringify(offset));
                console.log('openUrl', detailUrl);
                page.open(detailUrl, function(status) {
                    if (status !== 'success') {
                        console.log('Unable to access network.');
                        page.render('tmall.png');
                        phantom.exit(1);
                        return;
                    }
                    console.log('-->> success');
                    page.render('tmall.png');
                });
                // page.render('tmall.png');
                // setTimeout(function(){
                //     var left = offset.left + 10;
                //     var top =  offset.top + 10;
                //     console.log('click left', left, 'top', top);
                //     page.sendEvent('click', -left, -top);
                // }, 1000);
            })
        )
    });

    // if (page.injectJs("jquery.1.9.1.min.js")) {
    //     waitFor(function(){
    //         console.log('===> page.evaluate');
    //         return page.evaluate(function(){
    //             console.log('#mainsrp-itemlist', $('#mainsrp-itemlist'));
    //             console.log($('#mainsrp-itemlist').find('.items:nth-child(0)'));
    //             console.log($('#mainsrp-itemlist').find('.items:nth-child(0) item'));
    //             return true;//$('#mainsrp-itemlist').find('.items:nth-child(0) item').length > 0;
    //         })
    //     }, function(){
    //         var $item = $('#mainsrp-itemlist').find('.items:nth-child(0) item').eq(0);
    //         console.log('>>>', $item.find('a.pic-link').attr('href'));
    //     });
    // } else {
    //     console.log('injectJs failed');        
    // }
    
    // waitFor(function() {
    //     return page.evaluate(function() {
    //         return $("#J_DetailMeta").find(".tm-price").text() !== '' && $('#bd').find('.J_ReviewsCount').text() !== '';
    //     });
    // }, function() {
    //     console.log('-->> success.');
    //     page.render('tmall.png');
    //     phantom.exit(1);
    // });
    
    
});
