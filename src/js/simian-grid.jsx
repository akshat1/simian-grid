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
var LOAD_PAGE_SIZE = 60;
var OUTER_WRAPPER_STYLE = {
  overflow: 'auto',
  height: '100%',
  width: '100%'
};

var NO_ROWS_COMPONENT_STYLE = {
  whiteSpace: 'nowrap',
  position: 'absolute',
  fontSize: '5em',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

var CLASS_NAME = {
  OUTER_WRAPPER: 'simiangrid-wrapper',
  INNER_WRAPPER: 'simiangrid-inner-wrapper',
  EVEN: 'even',
  ODD: 'odd',
  HEADER_ROW: 'header',
  DUMMY: 'dummy',
  OUTER_WRAPPER: 'simiangrid-wrapper',
  NO_ROWS_COMPONENT: 'simian-grid-no-rows-component',
  LOADING_COMPONENT: 'simian-grid-loading-component'
};

var REF_NAME = {
  OUTER_WRAPPER: 'outer-wrapper',
  INNER_WRAPPER: 'inner-wrapper'
};


class SimianGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      innerWrapperHeight: 0,
      rows: []
    };
    window._grid = this;
  }


  // =============== Logic =========================================================================================================

  updateSelf(addendum) {
    if(!addendum)
      addendum = {}
    let state = this.state;
    let props = this.props;
    let isLoadingRows = false;
    let availRows = addendum.rows || state.rows; //concat without arguments doesn't throw an error
    let numAvailRows = availRows.length;
    let rowHeight = props.rowHeight;
    let wrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    let numTotalRows = props.numTotalRows;

    let innerWrapperHeight = numTotalRows * rowHeight;
    let cursorSize = Math.floor(wrapper.clientHeight / rowHeight);
    let numRowsAboveTheTopEdge = Math.floor(wrapper.scrollTop / rowHeight);
    let tableTopPos = ((numRowsAboveTheTopEdge - NUM_BUFFER_ROWS) * rowHeight) + (wrapper.scrollTop % rowHeight);
    let lowerBound = greater(numRowsAboveTheTopEdge - NUM_BUFFER_ROWS, 0);
    let upperBound = lesser(numRowsAboveTheTopEdge + cursorSize + NUM_BUFFER_ROWS, numTotalRows);
    let isMoreRowsRequired = false;
    if (upperBound > numAvailRows) {
      isLoadingRows = true;
      isMoreRowsRequired = !state.isLoadingRows; //Dont ask for more rows if we are already loading
      upperBound = numAvailRows;
      lowerBound = greater(lowerBound, numAvailRows - cursorSize - NUM_BUFFER_ROWS);
    }

    this.setState(_.merge(addendum, {
      numberOfDummyRows: greater(NUM_BUFFER_ROWS - numRowsAboveTheTopEdge, 0),
      innerWrapperHeight: innerWrapperHeight,
      lowerBound: lowerBound,
      upperBound: upperBound,
      tableTopPos: tableTopPos,
      isLoadingRows: isLoadingRows,
      maxScrollTopAllowed: (numAvailRows - cursorSize + 3) * rowHeight,
      rows: availRows
    }));

    if (isMoreRowsRequired) {
      this.loadMoreRows(upperBound, LOAD_PAGE_SIZE);
    }
  }


  loadMoreRows(loadFrom) {
    this.props.getRowsFunction(loadFrom, LOAD_PAGE_SIZE)
      .then(function(rows) {
        this.updateSelf({
          rows: this.state.rows.concat(rows)
        });
      }.bind(this));
  }

  // =============== Events =========================================================================================================

  setUpEventListeners() {
    let outerWrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    outerWrapper.addEventListener('scroll', this.handleScroll);
    outerWrapper.addEventListener('wheel', this.handleWheel);
    setupResizeHandling(outerWrapper, _.debounce(this.handleResize, 25));
  }


  rejectScrollIfLoading(evt) {
    if (this.state.isLoadingRows) {
      evt.preventDefault();
      return true;
    }
  }


  @autobind
  handleWheel(evt) {
    //this.rejectScrollIfLoading(evt);
    let wrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    let currentScrollTop = wrapper.scrollTop;
    let maxScrollTopAllowed = this.state.maxScrollTopAllowed;
    if (currentScrollTop >= maxScrollTopAllowed || currentScrollTop + evt.deltaY >= maxScrollTopAllowed) {
      evt.preventDefault();
    }
  }


  @autobind
  handleScroll(evt) {
    //if (this.rejectScrollIfLoading(evt))
    //  return;
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

  getInnerWrapperStyle() {
    return {
      height: this.state.innerWrapperHeight,
      position: 'relative',
      overflow: 'hidden'
    };
  }


  getLoadingComponentStyle() {
    return {
      top: this.refs[REF_NAME.OUTER_WRAPPER].scrollTop + 100,
      whiteSpace: 'nowrap',
      fontSize: '3.5em',
      background: 'rgba(0, 0, 0, 0.5)',
      color: '#FFF',
      borderRadius: '5px',
      padding: '5px 10px',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      boxShadow: '0px 0px 5px 1px rgba(0, 0, 0, 0.5)'
    }
  }


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


  renderCell(data, rowIndex, cellIndex) {
    let columnDefinition = this.props.columnDefinition[cellIndex];
    let className = columnDefinition ? columnDefinition.className : '';
    return (
      <td key={`cell-${rowIndex}-${cellIndex}`} style={this.getCellStyle()} className={className}>
        {data}
      </td>
    );
  }


  renderRow(row, index) {
    let evenOdd = index % 2 === 0 ? 'even' : 'odd';
    let renderedCells = [];
    for (var i = 0, len = row.length; i < len; i++)
      renderedCells.push(this.renderCell(row[i], index, i));

    return (
      <tr key={index} className={evenOdd}>
        {renderedCells}
      </tr>
    );
  }


  @autobind
  renderHeaderCell(cellTemplate, index) {
    return (
      <td key={`header-cell-${index}`} style={this.getCellStyle()} className={cellTemplate.className}>
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
    let numRowsToRender = state.upperBound - lowerBound;
    let rows = state.rows;

    let renderedRows = this.renderDummyRows(state.numberOfDummyRows);
    for(let i = 0; i < numRowsToRender; i++) {
      let row = rows[i + lowerBound];
      renderedRows.push(this.renderRow(row, lowerBound + i));
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


  renderNoRowsMessage() {
    if (this.props.numTotalRows === 0)
      return (
        <div className={CLASS_NAME.NO_ROWS_COMPONENT} style={NO_ROWS_COMPONENT_STYLE}>
          No Rows Found
        </div>
      );
  }


  renderLoadingComponent() {
    if (this.state.isLoadingRows) {
      return (
        <div className={CLASS_NAME.LOADING_COMPONENT} style={this.getLoadingComponentStyle()}>
          Loading . . .
        </div>
      );
    }
  }


  render() {
    return (
      <div className={CLASS_NAME.OUTER_WRAPPER} style={OUTER_WRAPPER_STYLE} ref={REF_NAME.OUTER_WRAPPER}>
        <div className={CLASS_NAME.INNER_WRAPPER} style={this.getInnerWrapperStyle()} ref={REF_NAME.INNER_WRAPPER}>
          {this.renderTable()}
          {this.renderLoadingComponent()}
        </div>
        {this.renderNoRowsMessage()}
      </div>
    );
  }
}


SimianGrid.propTypes = {
  getRowsFunction: React.PropTypes.func,
  numTotalRows: React.PropTypes.number,
  columnDefinition: React.PropTypes.arrayOf(React.PropTypes.shape({
    title: React.PropTypes.string,
    className: React.PropTypes.string
  })),
  rowHeight: React.PropTypes.number
};


module.exports = SimianGrid;
