'use strict';

var generateData = require('./datagen.js');
var ReactDOM = require('react-dom');
var React = require('react');
var SimianGrid = require('./simianGrid.jsx');


function makeDataModel() {
  var columns = [];
  var rows = generateData(1000, [{
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
    rows       : rows,
    cursorSize : 10
  };
}


document.addEventListener('DOMContentLoaded', function() {
  window.model = makeDataModel();
  ReactDOM.render(
    <SimianGrid rows={model.rows} cursorSize={model.cursorSize} numTotalRows={model.rows.length}/>,
    document.getElementById('demoRoot')
  );
});