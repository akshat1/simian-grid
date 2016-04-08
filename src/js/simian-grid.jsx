'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var autobind = require('autobind-decorator');
var _ = require('lodash');
var setupResizeHandling = require('element-resize-event');


function lesser(a, b){
  return a < b ? a : b;
}


function greater(a, b){
  return a > b ? a : b;
}


var NUM_BUFFER_ROWS = 5;
var OUTER_WRAPPER_STYLE = {
  overflow: 'auto',
  height: '100%',
  width: '100%',
  background: 'lime'
};

var CLASS_NAME = {
  OUTER_WRAPPER: 'simiangrid-wrapper',
  INNER_WRAPPER: 'simiangrid-inner-wrapper',
  EVEN: 'even',
  ODD: 'odd',
  HEADER_ROW: 'header',
  DUMMY: 'dummy',
  OUTER_WRAPPER: 'simiangrid-wrapper'
};

var REF_NAME = {
  OUTER_WRAPPER: 'outer-wrapper',
  INNER_WRAPPER: 'inner-wrapper'
};


class SimianGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      innerWrapperHeight: 0
    };
    window._grid = this;
  }


  // =============== Logic =========================================================================================================

  updateSelf(addendum) {
    let props = this.props;
    let rowHeight = props.rowHeight;
    let wrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    let numTotalRows = props.numTotalRows;
    let innerWrapperHeight = numTotalRows * rowHeight;
    let cursorSize = Math.floor(wrapper.clientHeight / rowHeight);
    let numRowsAboveTheTopEdge = Math.floor(wrapper.scrollTop / rowHeight);
    let tableTopPos = ((numRowsAboveTheTopEdge - NUM_BUFFER_ROWS) * rowHeight) + (wrapper.scrollTop % rowHeight);

    this.setState({
      numberOfDummyRows: greater(NUM_BUFFER_ROWS - numRowsAboveTheTopEdge, 0),
      innerWrapperHeight: innerWrapperHeight,
      lowerBound: greater(numRowsAboveTheTopEdge - NUM_BUFFER_ROWS, 0),
      upperBound: lesser(numRowsAboveTheTopEdge + cursorSize + NUM_BUFFER_ROWS, numTotalRows),
      tableTopPos: tableTopPos
    });
  }

  // =============== Events =========================================================================================================

  setUpEventListeners() {
    let outerWrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    outerWrapper.addEventListener('scroll', this.handleScroll);
    setupResizeHandling(outerWrapper, _.debounce(this.handleResize, 50));
  }


  @autobind
  handleScroll() {
    this.updateSelf();
  }


  @autobind
  handleResize() {
    this.updateSelf();
  }


  // =============== Life-Cycle ========================================================================================================

  componentDidMount() {
    this.setUpEventListeners();
    this.updateSelf();
  }


  // =============== Rendering =========================================================================================================

  @autobind
  getInnerWrapperStyle() {
    return {
      height: this.state.innerWrapperHeight,
      position: 'relative',
      overflow: 'hidden',
      background: 'orange'
    };
  }


  @autobind
  getTableStyle() {
    return {
      top: this.state.tableTopPos,
      borderCollapse: 'collapse',
      width: '100%',
      position: 'absolute'
    }
  }


  getCellStyle() {
    return {
      boxSizing: 'border-box',
      height: this.props.rowHeight,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }


  renderRow(row, index) {
    let evenOdd = index % 2 === 0 ? CLASS_NAME.EVEN : CLASS_NAME.ODD;
    return (
      <tr key={index} className={evenOdd}>
        <td style={this.getCellStyle()} key={`cell-${index}-0`}>
          {`Row ${index}`}
        </td>
      </tr>
    );
  }


  @autobind
  renderHeaderCell(cellTemplate, index) {
    return (
      <td key={`header-cell-${index}`} style={this.getCellStyle()}>
        {cellTemplate.title}
      </td>
    );
  }


  renderHeaderRow() {
    let cells = this.props.columnDefinition.map(this.renderHeaderCell);
    return (
      <tr className={CLASS_NAME.HEADER_ROW} key='header-row'>
        {cells}
      </tr>
    );
  }


  renderDummyRows(numDummyRows) {
    var rows = [];
    for (var i = 0; i < numDummyRows; i++) {
      rows.push(
        <tr className={CLASS_NAME.DUMMY} key={`dummy-row-${i}`}>
          <td style={this.getCellStyle()}>
            DUMMY
          </td>
        </tr>
      );
    }
    return rows;
  }


  renderBody() {
    let state = this.state;
    let lowerBound = state.lowerBound;
    let upperBound = state.upperBound;
    let numRowsToRender = upperBound - lowerBound;
    let numberOfDummyRows = state.numberOfDummyRows;
    let renderedRows = this.renderDummyRows(numberOfDummyRows);
    for(let i = 0; i < numRowsToRender; i++) {
      renderedRows.push(this.renderRow(null, lowerBound + i));
    }
    renderedRows.splice(NUM_BUFFER_ROWS, 0, this.renderHeaderRow());
    return (
      <tbody>
        {renderedRows}
      </tbody>
    );
  }


  renderTable() {
    return (
      <table style={this.getTableStyle()}>
        {this.renderBody()}
      </table>
    );
  }


  render() {
    return (
      <div className={CLASS_NAME.OUTER_WRAPPER} style={OUTER_WRAPPER_STYLE} ref={REF_NAME.OUTER_WRAPPER}>
        <div className='' style={this.getInnerWrapperStyle()} ref={REF_NAME.INNER_WRAPPER}>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}


module.exports = SimianGrid;
