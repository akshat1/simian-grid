'use strict';

var randomString = require('random-string');


var DataType = {
  NUMBER: 'NUMBER',
  STRING: 'STRING'
};


function makeNumberCell(cellTemplate) {
  return Number(randomString({
    length: cellTemplate.length || 5,
    letters: false
  }));
}


function makeStringCell(cellTemplate) {
  return randomString({
    length: cellTemplate.length || 8,
    numeric: false
  });
}


function makeCell(cellTemplate) {
  switch (cellTemplate.dataType.toUpperCase()) {
    case DataType.NUMBER: return makeNumberCell(cellTemplate);
    case DataType.STRING: return makeStringCell(cellTemplate);
    default: return makeNumberCell(cellTemplate);
  }
  return Math.random() * 100;
}


function makeRow(rowTemplate) {
  return rowTemplate.map(makeCell);
}


module.exports = function generateData(numRows, rowTemplate) {
  var result = [];
  for (var i = 0; i < numRows; i++) {
    result.push(makeRow(rowTemplate));
  }
  return result;
}
