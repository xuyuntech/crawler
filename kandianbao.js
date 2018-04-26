const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Excel = require('exceljs');

const log = console;
const sequelize = new Sequelize('mysql://root:just4fun@localhost:3306/foo');


function exportExcel() {
  const paths = [];
  const pBrands = path.join(__dirname, './public/tmall_top10_brand');
  fs.readdirSync(pBrands).forEach((fName) => {
    paths.push(fName);
  });

  const workbook = new Excel.Workbook();

  workbook.creator = 'Me';
  workbook.lastModifiedBy = 'Her';
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);

  paths.sort((a, b) => {
    const a1 = parseInt(a.split('__')[0]);
    const b1 = parseInt(b.split('__')[0]);
    if (a1 < b1) return -1;
    else if (a1 > b1) return 1;
    return 0;
  });

  parseTable('./public/kandianbao.html', genWorksheet('所有品牌'));
  paths.forEach((p) => {
    parseTable(path.join(pBrands, p), genWorksheet(p.match(/\d__(.*)\.html/)[1]));
  });

  workbook.xlsx.writeFile('tmall.xlsx')
    .then(() => {
      // done
      log.log('===> done');
    });
}

function genWorksheet(name) {
  const worksheet = workbook.addWorksheet(name);

  worksheet.columns = [
    { header: '天猫链接', key: 'link', width: 50 },
    { header: '品牌', key: 'brand', width: 32 },
    { header: '型号', key: 'model', width: 32 },
    { header: '价格', key: 'price', width: 10 },
    { header: '付款数', key: 'sales', width: 10 },
    { header: '月销量', key: 'trade', width: 10 },
    { header: '总销量', key: 'allTrade', width: 10 },
    { header: '发货地', key: 'loc', width: 20 },
    { header: '收藏', key: 'keep', width: 10 },
    { header: '评论数', key: 'rates', width: 10 },
    { header: '标题', key: 'title', width: 60 },
    { header: '评论标签', key: 'ratesTags', width: 100 },
    { header: 'dsr', key: 'dsr', width: 50 },
  ];
  worksheet.getColumn(1).font = { color: { argb: 'FF1d9200' } };
  return worksheet;
}

function getDataFromFile(filePath) {
  const html = fs.readFileSync(filePath);
  const $ = cheerio.load(html.toString());
  const data = [];
  $('table tbody tr').each((k, v) => {
    const $v = $(v);
    let brand;
    let title;
    let model;
    let effort;
    // const imgUrl = $v.find('td[data-link]').attr('data-link');
    const dataHint = $v.find('td.title span[data-hint]').attr('data-hint') || '';
    // var title = dataHint.split('\n')[0].split('：')[1] || '';
    dataHint.split('\n').forEach((v1) => {
      let vv = v1;
      vv = vv.replace(/\s/g, '');
      vv = vv.replace(/：/g, ':');
      const parts = vv.split(':');
      const pValue = parts[1];
      switch (parts[0]) {
        case '品牌':
          brand = pValue;
          break;
        case '宝贝标题':
          title = pValue;
          break;
        case '型号':
          model = pValue;
          break;
        case '功效':
          effort = pValue;
          break;
        default:
          break;
      }
    });
    let hyperlink = $v.find('td.title span[data-hint] a').attr('href') || '';
    hyperlink = `http:${hyperlink}`;
    const price = $v.find('td.price').text().trim();
    const sales = $v.find('td.sales span:last-child').text().trim();
    const trade = $v.find('td.trade').text().trim();
    const allTrade = parseInt($v.find('td.all-trade').text().trim(), 10);
    const dsr = $v.find('td.dsr span[data-hint]').attr('data-hint');
    const loc = $v.find('td.loc').text().trim();
    const keep = $v.find('td.keep').text().trim();
    const ratesTags = $v.find('td.rates a[data-hint]').attr('data-hint');
    const rates = $v.find('td.rates a').text().trim();

    const d = {
      link: { text: hyperlink, hyperlink },
      brand,
      model,
      title,
      price,
      sales,
      trade,
      allTrade,
      dsr,
      loc,
      keep,
      rates,
      ratesTags,
      effort,
    };
    data.push(d);
  });
  return data;
}

function parseTable(filePath, worksheet) {
  getDataFromFile(filePath).forEach((item) => {
    worksheet.addRow(item);
  });
}

const Tmall = sequelize.define('tmall', {
  link: {
    type: Sequelize.STRING,
    unique: true,
  },
  brand: Sequelize.STRING,
  model: Sequelize.STRING,
  price: Sequelize.NUMERIC(12, 2),
  sales: Sequelize.INTEGER(),
  trade: Sequelize.INTEGER(),
  allTrade: Sequelize.INTEGER(),
  loc: Sequelize.STRING,
  keep: Sequelize.INTEGER(),
  rates: Sequelize.INTEGER(),
  title: Sequelize.STRING,
  // score_d: Sequelize.NUMERIC(12, 1),
  // score_s: Sequelize.NUMERIC(12, 1),
  // score_r: Sequelize.NUMERIC(12, 1),
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
});


const Effort = sequelize.define('effort', {
  name: Sequelize.STRING,
  trade: Sequelize.INTEGER(),
});

function exportMysqlData() {
  const data = getDataFromFile('./public/mysql.html');

  const dData = [];
  const effortsHash = {};
  const hash = {};
  data.forEach((item) => {
    const url = item.link.text;
    const { effort, allTrade } = item;
    // const effort = item.effort || '';
    // const allTrade = item.allTrade;
    if (!hash[url]) {
      dData.push(Object.assign({}, item, { link: url }));
      hash[url] = true;
    }
    if (effort) {
      const trimEffort = effort.replace(/\s/g, '');
      trimEffort.split(',').forEach((effortItem) => {
        if (!effortsHash[effortItem]) {
          effortsHash[effortItem] = allTrade;
        } else {
          effortsHash[effortItem] += allTrade;
        }
      });
    }
  });
  const efforts = [];
  Object.keys(effortsHash).forEach((k) => {
    efforts.push({
      name: k,
      trade: effortsHash[k],
    });
  });
  log.log('efforts\n', efforts);
  Effort.sync({ force: true }).then(() => {
    Effort.bulkCreate(efforts).then(() => {
      log.log('efforts >>>>> done');
    });
  });
  // Tmall.sync({ force: true }).then(() => {
  //   Tmall.bulkCreate(dData).then(() => {
  //     log.log('===>> done');
  //   });
  // });
}

exportMysqlData();
