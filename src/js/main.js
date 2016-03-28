'use strict';

var generateData = require('./datagen.js');
var ReactDOM = require('react-dom');
var React = require('react');
var SimianGrid = require('./simianGrid.jsx');

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
    }
  ];

  var rows = generateData(window.navigator.userAgent.indexOf('Firefox') === -1 ? 1000000 : 100000, [{
    dataType : 'NUMBER',
    isCount  : true
  },{
    dataType : 'STRING',
    length   : 12
  },{
    dataType : 'STRING',
    length   : 8
  },{
    dataType : 'NUMBER',
    length   : 5
  },{
    dataType : 'NUMBER',
    length   : 5
  },
  ]);

  return {
    columnDefinition : columnDefinition,
    rowHeight        : 39,
    rows             : rows
  };
}


document.addEventListener('DOMContentLoaded', function() {
  window.model = makeDataModel();
  ReactDOM.render(
    <SimianGrid
      rows={model.rows}
      numTotalRows={model.rows.length}
      columnDefinition={model.columnDefinition}
      rowHeight={model.rowHeight}
    />,
    document.getElementById('demoRoot')
  );
});