const Crawler = require('crawler');

const c = new Crawler({
  maxConnections: 10,
  // This will be called for each crawled page
  callback(error, res, done) {
    if (error) {
      console.log(error);
    } else {
      const { $ } = res;
      console.log($('title').text());
      console.log($('.tb-detail-hd').text());
      // $ is Cheerio by default
      // a lean implementation of core jQuery designed specifically for the server
    }
    done();
  },
});

// 评分，评论 https://dsr-rate.tmall.com/list_dsr_info.htm?itemId=43981898210&spuId=275434634&sellerId=2081948193&_ksTS=1523938992811_210&callback=jsonp211
// Queue just one URL, with default callback
c.queue('https://list.tmall.com/search_product.htm?q=%C1%E9%D6%A5%E6%DF%D7%D3%B7%DB&type=p&vmarket=&spm=875.7931836%2FB.a2227oh.d100&xl=%C1%E9%D6%A5%E6%DF%D7%D3_1&from=mallfp..pc_1_suggest&smToken=9593b867b81a4cbc83a685aff6ab04f8&smSign=Vy%2B1SHwtZWeP978guxldMg%3D%3D');

c.on('drain', () => {

});
