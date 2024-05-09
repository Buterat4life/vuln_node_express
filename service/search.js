const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/vulny.db');

const searchByName = function (searchText, cb) {
  db.all("SELECT id, name, description FROM item WHERE name LIKE ?", ['%' + searchText + '%'], function (err, rows) {
    if (err) {
      console.log('error ' + err);
      cb(err);
    } else {
      console.log('rows? ' + rows);
      console.log('got ' + rows.length + ' rows');
      const ret = {
        searchText: searchText,
        rows: rows
      };
      cb(null, ret);
    }
  });
};

module.exports = {
  searchByName: searchByName
};
