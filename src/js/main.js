'use strict';

var generateData = require('./datagen.js');
var ReactDOM = require('react-dom');
var React = require('react');
var SimianGrid = require('./simianGrid.jsx');


function makeDataModel() {
  var columns = [];
  var rows = generateData(100, [{
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
    rows: rows
  };
}


document.addEventListener('DOMContentLoaded', function() {
  window.model = makeDataModel();
  ReactDOM.render(
    <SimianGrid rows={model.rows}/>,
    document.getElementById('demoRoot')
  );
});