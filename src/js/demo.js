'use strict';

var generateData = require('./datagen.js');
var ReactDOM = require('react-dom');
var React = require('react');
var SimianGrid = require('./simian-grid.jsx');

window.React = React;
window.ReactDOM = ReactDOM;

var MAX_ROWS = 1000000;

// used by datagen to produce sample data
var dataTemplate = [{
  dataType: 'NUMBER',
  isCount: true
}, {
  dataType: 'STRING',
  length: 12
}, {
  dataType: 'STRING',
  length: 8
}, {
  dataType: 'NUMBER',
  length: 5
}, {
  dataType: 'NUMBER',
  length: 5
}, {
  dataType: 'STRING',
  length: 8
}, {
  dataType: 'NUMBER',
  length: 8
}];


// Used by simian-grid to render column headers etc.
var columnDefinition = [{
  title: 'Count',
  className: 'count'
}, {
  title: 'First',
  className: 'first'
}, {
  title: 'Column Two',
  className: 'column-two'
}, {
  title: 'Tre',
  className: 'tre'
}, {
  title: 'Double Two',
  className: 'double-two'
}, {
  title: 'No Name 001'
}, {
  title: 'No Name 002'
}];


function getRows(from, num) {
  return new Promise(function(resolve, reject) {
    var rows = generateData(num, dataTemplate);
    if(from !== 0)
      rows.forEach(function(row) {
        row[0] += from; //We already know this is the count; So a little hack instead of changing datagen for now
      });
    // Simulate data fetch lag
    setTimeout(function() {
      resolve(rows);
    }, 250);
  });
}


function makeDataModel() {
  return {
    columnDefinition: columnDefinition,
    rowHeight: 40,
    numTotalRows: MAX_ROWS,
    getRowsFunction: getRows
  };
}


function insertStyleRules() {
  var sheetElement = document.createElement('style');
  sheetElement.appendChild(document.createTextNode(''));
  document.head.appendChild(sheetElement);

  var sheet = document.styleSheets[0];
  sheet.insertRule(".even { background: #DDEEFF; }", 0);
  sheet.insertRule(".odd { background: #FFF; }", 0);
  sheet.insertRule(".header { background: #1ACEF7; color: #FFF; }", 0);
  sheet.insertRule("td { padding: 5px; }", 0);
}


document.addEventListener('DOMContentLoaded', function() {
    var model = makeDataModel();
    window.model = model;
    insertStyleRules();
    var demoRootStyle = {
      border: '1px solid black',
      width: '85vw',
      height: '85vh',
      fontFamily: 'sans-serif',
      color: '#000',
      margin: '20px auto'
    };
    ReactDOM.render(
      <div id = 'demoRoot' style = {demoRootStyle}>
        <SimianGrid
          getRowsFunction={model.getRowsFunction}
          numTotalRows={model.numTotalRows}
          columnDefinition={model.columnDefinition}
          rowHeight={model.rowHeight}
          pageSize={100}
          numBufferRows={50}
        />
      </div>,
      document.body
    );
});