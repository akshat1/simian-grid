'use strict';

var randomString = require('random-string');


var DataType = {
  NUMBER: 'NUMBER',
  STRING: 'STRING'
};


function makeNumberCell(cellTemplate, rowIndex, cellIndex) {
  if (cellTemplate.isCount) {
    return rowIndex;

  } else {
    return Number(randomString({
      length: cellTemplate.length || 5,
      letters: false
    }));
  }
}


function makeStringCell(cellTemplate, rowIndex, cellIndex) {
  return randomString({
    length: cellTemplate.length || 8,
    numeric: false
  });
}


function makeCell(cellTemplate, rowIndex, cellIndex) {
  switch (cellTemplate.dataType.toUpperCase()) {
    case DataType.NUMBER: return makeNumberCell(cellTemplate, rowIndex, cellIndex);
    case DataType.STRING: return makeStringCell(cellTemplate, rowIndex, cellIndex);
    default: return makeNumberCell(cellTemplate);
  }
  return Math.random() * 100;
}


function makeRow(rowTemplate, rowIndex) {
  return rowTemplate.map(function(cellTemplate, cellIndex) {
    return makeCell(cellTemplate, rowIndex, cellIndex);
  });
}


module.exports = function generateData(numRows, rowTemplate) {
  var result = [];
  for (var i = 0; i < numRows; i++) {
    result.push(makeRow(rowTemplate, i));
  }
  return result;
}
