'use strict';

var generateData = require('./datagen.js');
var ReactDOM = require('react-dom');
var React = require('react');
var SimianGrid = require('./simian-grid.jsx');

window.React = React;
window.ReactDOM = ReactDOM;


function makeDataModel() {
  var columnDefinition = [
    {
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
    }
  ];

  var rows = generateData(window.navigator.userAgent.indexOf('Firefox') === -1 ? 1000000 : 100000, [{
    dataType : 'NUMBER',
    isCount  : true
  }, {
    dataType : 'STRING',
    length   : 12
  }, {
    dataType : 'STRING',
    length   : 8
  }, {
    dataType : 'NUMBER',
    length   : 5
  }, {
    dataType : 'NUMBER',
    length   : 5
  }, {
    dataType : 'STRING',
    length   : 8
  }, {
    dataType : 'NUMBER',
    length   : 8
  }
  ]);

  return {
    columnDefinition : columnDefinition,
    rowHeight        : 39,
    rows             : rows
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
  window.model = makeDataModel();
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
    <div id='demoRoot' style={demoRootStyle}>
      <SimianGrid
        rows={model.rows}
        numTotalRows={model.rows.length}
        columnDefinition={model.columnDefinition}
        rowHeight={model.rowHeight}
      />
    </div>,
    document.body
  );
});