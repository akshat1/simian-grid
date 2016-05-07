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
  var rows = generateData(num, dataTemplate);
  if(from !== 0)
    rows.forEach(function(row) {
      row[0] += from; //We already know this is the count; So a little hack instead of changing datagen for now
    });
  return Promise.resolve(rows);
}


class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };
    this.onMoreRowsNeeded = this.onMoreRowsNeeded.bind(this);
  }


  onMoreRowsNeeded(from, numItems) {
    let _self = this;
    getRows(from, numItems)
    .then(function(newRows) {
      _self.setState({
        isLoading: false,
        rows: _self.state.rows.concat(newRows)
      });
    });

    this.setState({
      isLoading: true
    });
  }


  shouldComponentUpdate(nextProps, nextState) {
    return this.state.rows !== nextState.rows;
  }


  render() {
    return (
      <div id = 'demoRoot'>
        <SimianGrid
          ref              = 'SIMIAN_GRID'
          rows             = {this.state.rows}
          onMoreRowsNeeded = {this.onMoreRowsNeeded}
          isLoading        = {this.state.isLoading}
          numTotalRows     = {MAX_ROWS}
          columnDefinition = {columnDefinition}
          rowHeight        = {50}
          pageSize         = {1000}
          numBufferRows    = {25}
        />
      </div>
    );
  }
}


document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <Demo />,
      document.body
    );
});
