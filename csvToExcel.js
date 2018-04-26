const Excel = require('exceljs');

const workbook = new Excel.Workbook();
workbook.csv.readFile('./jd.csv')
  .then(() => {
    // use workbook or worksheet
    workbook.xlsx.writeFile('./jd.xlsx')
      .then(() => {
        // done
      });
  });
