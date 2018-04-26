const Excel = require('exceljs');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://root:just4fun@localhost:3306/foo');
const JD = sequelize.define('jd', {
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
const EffortJD = sequelize.define('effort_jd', {
  name: Sequelize.STRING,
  trade: Sequelize.INTEGER(),
});
const log = console;

const workbook = new Excel.Workbook();

workbook.xlsx.readFile('./jd_data.xlsx')
  .then(() => {
    // done
    const worksheet = workbook.getWorksheet(1);
    const { rowCount } = worksheet;
    const data = [];
    const effortHash = {};
    for (let i = 2; i <= rowCount; i += 1) {
      const row = worksheet.getRow(i);
      const pid = row.getCell('A').value;
      const title = row.getCell(3).value;
      const allTrade = parseInt(row.getCell(4).value, 10);
      const price = row.getCell('L').value;
      const brand = row.getCell('M').value;
      const link = `https://item.jd.com/${pid}.html`;
      const loc = row.getCell('O').value;
      const effortO = row.getCell('N').value || '';
      const effortArr = effortO.replace(/，/g, ',').split(',');
      data.push({
        link,
        title,
        allTrade,
        price,
        brand,
        loc,
      });
      effortArr.forEach((v) => {
        if (!effortHash[v]) {
          effortHash[v] = allTrade;
        } else {
          effortHash[v] += allTrade;
        }
      });
    }
    const efforts = [];
    Object.keys(effortHash).forEach((k) => {
      if (k) {
        efforts.push({
          name: k,
          trade: effortHash[k],
        });
      }
    });
    JD.sync({ force: true }).then(() => {
      JD.bulkCreate(data).then(() => {
        log.log('JD ===>> done');
      });
    });
    EffortJD.sync({ force: true }).then(() => {
      EffortJD.bulkCreate(efforts).then(() => {
        log.log('EffortJD ===>> done');
      });
    });
  });
