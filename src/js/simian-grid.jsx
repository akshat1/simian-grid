'use strict';

const React = require('react');
const autobind = require('autobind-decorator');
const _ = require('lodash');
const setupResizeHandling = require('element-resize-event');


function lesser(a, b){
  return a < b ? a : b;
}


function greater(a, b){
  return a > b ? a : b;
}


const NUM_BUFFER_ROWS = 10;
const DEFAULT_PAGE_SIZE = 60;
const OUTER_WRAPPER_STYLE = {
  overflow: 'auto',
  height: '100%',
  width: '100%'
};

const NO_ROWS_COMPONENT_STYLE = {
  whiteSpace: 'nowrap',
  position: 'absolute',
  fontSize: '5em',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)'
};

const CLASS_NAME = {
  OUTER_WRAPPER: 'simiangrid-wrapper',
  INNER_WRAPPER: 'simiangrid-inner-wrapper',
  LIST_CONTAINER: 'simian-grid-list-container',
  EVEN: 'even',
  ODD: 'odd',
  HEADER_ROW: 'header',
  DUMMY: 'dummy',
  OUTER_WRAPPER: 'simiangrid-wrapper',
  NO_ROWS_COMPONENT: 'simian-grid-no-rows-component',
  LOADING_COMPONENT: 'simian-grid-loading-component',
  LIST_ROW: 'simian-grid-list-row'
};

const REF_NAME = {
  OUTER_WRAPPER: 'outer-wrapper',
  INNER_WRAPPER: 'inner-wrapper'
};


class SimianGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      innerWrapperHeight: 0
    };
  }


  // =============== Logic =========================================================================================================

  updateSelf(addendum, nextProps) {
    if(!addendum)
      addendum = {}
    let state = this.state;
    let props = _.merge({}, this.props, nextProps);
    let isLoadingRows = false;
    let availRows = addendum.rows || props.rows;
    let numAvailRows = availRows.length;
    let rowHeight = props.rowHeight;
    let wrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    let numTotalRows = props.numTotalRows;
    let numBufferRows = props.numBufferRows || NUM_BUFFER_ROWS;

    let innerWrapperHeight = numTotalRows * rowHeight;
    let cursorSize = Math.floor(wrapper.clientHeight / rowHeight);
    let numRowsAboveTheTopEdge = Math.floor(wrapper.scrollTop / rowHeight);
    let tableTopPos = ((numRowsAboveTheTopEdge - numBufferRows) * rowHeight) + (wrapper.scrollTop % rowHeight);
    let lowerBound = greater(numRowsAboveTheTopEdge - numBufferRows, 0);
    let upperBound = lesser(numRowsAboveTheTopEdge + cursorSize + numBufferRows, numTotalRows);
    let isMoreRowsRequired = false;
    if (upperBound > numAvailRows) {
      isLoadingRows = true;
      isMoreRowsRequired = !state.isLoadingRows; //Dont ask for more rows if we are already loading
      upperBound = numAvailRows;
      lowerBound = greater(lowerBound, numAvailRows - cursorSize - numBufferRows);
    }

    this.setState(_.merge(addendum, {
      numberOfDummyRows: greater(numBufferRows - numRowsAboveTheTopEdge, 0),
      innerWrapperHeight: innerWrapperHeight,
      lowerBound: lowerBound,
      upperBound: upperBound,
      tableTopPos: tableTopPos,
      isLoadingRows: isLoadingRows,
      maxScrollTopAllowed: (numAvailRows - cursorSize + 3) * rowHeight
    }));

    if (isMoreRowsRequired) {
      this.loadMoreRows(upperBound);
    }
  }


  loadMoreRows(loadFrom, howMany) {
    let onMoreRowsNeeded = this.props.onMoreRowsNeeded
    if (typeof onMoreRowsNeeded === 'function')
      onMoreRowsNeeded(loadFrom, this.props.pageSize || DEFAULT_PAGE_SIZE);
  }


  // =============== Events =========================================================================================================

  setUpEventListeners() {
    let outerWrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    outerWrapper.addEventListener('scroll', this.handleScroll);
    outerWrapper.addEventListener('wheel', this.handleWheel);
    setupResizeHandling(outerWrapper, _.debounce(this.handleResize, 25));
    this.wireEventsMap(this.props.events);
  }


  wireEventsMap(eventsMap) {
    let outerWrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    if(!outerWrapper)
      return;

    for (let eventName in eventsMap)
      outerWrapper.addEventListener(eventName, eventsMap[eventName]);
  }


  unWireEventsMap(eventsMap) {
    let outerWrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    if(!outerWrapper)
      return;

    for (let eventName in eventsMap)
      outerWrapper.removeEventListener(eventName, eventsMap[eventName]);
  }


  @autobind
  handleWheel(evt) {
    let wrapper = this.refs[REF_NAME.OUTER_WRAPPER];
    let currentScrollTop = wrapper.scrollTop;
    let maxScrollTopAllowed = this.state.maxScrollTopAllowed;
    if (currentScrollTop >= maxScrollTopAllowed || currentScrollTop + evt.deltaY >= maxScrollTopAllowed) {
      evt.preventDefault();
    }
  }


  @autobind
  handleScroll(evt) {
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


  componentWillReceiveProps(nextProps) {
    this.unWireEventsMap(this.props.events);
    this.wireEventsMap(nextProps.events);
    this.updateSelf(null, nextProps);
  }


  // =============== Rendering =========================================================================================================

  getInnerWrapperStyle() {
    return {
      height: this.state.innerWrapperHeight,
      position: 'relative'
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


  getListStyle() {
    return {
      top: this.state.tableTopPos,
      min-width: '100%',
      position: 'absolute'
    }
  }


  getListRowStyle() {
    return {
      boxSizing: 'border-box',
      height: this.props.rowHeight,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    };
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
    if (data.__html) {
      return (
        <td key={`cell-${rowIndex}-${cellIndex}`} style={this.getCellStyle()} className={className} dangerouslySetInnerHTML={data}>
        </td>
      );
    } else
      return (
        <td key={`cell-${rowIndex}-${cellIndex}`} style={this.getCellStyle()} className={className}>
          {data}
        </td>
      );
  }


  renderTableRow(row, index) {
    let evenOdd = index % 2 === 0 ? 'even' : 'odd';
    let renderedCells = [];
    for (let i = 0, len = row.length; i < len; i++)
      renderedCells.push(this.renderCell(row[i], index, i));

    return (
      <tr key={index} className={evenOdd}>
        {renderedCells}
      </tr>
    );
  }


  @autobind
  renderHeaderTableCell(cellTemplate, index) {
    if (cellTemplate.titleHTML) {
      let oHTML = {
        __html: cellTemplate.titleHTML
      };
      return (
        <td key={`header-cell-${index}`} style={this.getCellStyle()} className={cellTemplate.className} dangerouslySetInnerHTML={oHTML}>
        </td>
      );
    } else
      return (
        <td key={`header-cell-${index}`} style={this.getCellStyle()} className={cellTemplate.className}>
          {cellTemplate.title}
        </td>
      );
  }


  @autobind
  renderHeaderTableRow() {
    let cells = this.props.columnDefinition.map(this.renderHeaderTableCell);
    return (
      <tr className={CLASS_NAME.HEADER_ROW} key='header-row'>
        {cells}
      </tr>
    );
  }


  @autobind
  renderDummyTableRows(numDummyRows) {
    let colSpan = this.props.columnDefinition.length;
    let rows = [];
    for (let i = 0; i < numDummyRows; i++) {
      rows.push(
        <tr className={CLASS_NAME.DUMMY} key={`dummy-row-${i}`}>
          <td style={this.getCellStyle()} colSpan={colSpan}>
            DUMMY
          </td>
        </tr>
      );
    }
    return rows;
  }


  renderRow(row, index) {
    let evenOdd = index % 2 === 0 ? 'even' : 'odd';
    if (row.__html) {
      return (
        <div className={`${evenOdd} ${CLASS_NAME.LIST_ROW}`} key={index} style={this.getListRowStyle()} dangerouslySetInnerHTML={row}>
        </div>
      );
    } else
      return (
        <div className={`${evenOdd} ${CLASS_NAME.LIST_ROW}`} key={index} style={this.getListRowStyle()}>
          {row.component || row}
        </div>
      );
  }


  renderHeaderRow() {
    let row = this.props.headerRow;
    if (row.__html) {
      return (
        <div className={`${CLASS_NAME.HEADER_ROW} ${CLASS_NAME.LIST_ROW}`} style={this.getListRowStyle()} dangerouslySetInnerHTML={row}>
        </div>
      );
    } else
      return (
        <div className={`${CLASS_NAME.HEADER_ROW} ${CLASS_NAME.LIST_ROW}`} style={this.getListRowStyle()}>
          {row.component || row}
        </div>
      );
  }


  @autobind
  renderDummyRows(numDummyRows) {
    let colSpan = this.props.columnDefinition.length;
    let rows = [];
    for (let i = 0; i < numDummyRows; i++) {
      rows.push(
        <div className={`${CLASS_NAME.DUMMY} ${CLASS_NAME.LIST_ROW}`} style={this.getListRowStyle()} key={`dummy-row-${i}`}>
          DUMMY
        </div>
      );
    }
    return rows;
  }


  renderBody(noTable) {
    let state = this.state;
    let lowerBound = state.lowerBound;
    let numRowsToRender = state.upperBound - lowerBound;
    let rows = this.props.rows;

    let renderedRows = (noTable ? this.renderDummyRows : this.renderDummyTableRows)(state.numberOfDummyRows);
    for(let i = 0; i < numRowsToRender; i++) {
      let row = rows[i + lowerBound];
      if (noTable)
        renderedRows.push(this.renderRow(row, lowerBound + i));
      else
        renderedRows.push(this.renderTableRow(row, lowerBound + i));
    }
    let headerRow = noTable ? this.renderHeaderRow() : this.renderHeaderTableRow();
    renderedRows.splice(this.props.numBufferRows || NUM_BUFFER_ROWS, 0, headerRow);
    return renderedRows;
  }


  renderTable() {
    return (
      <table style={this.getTableStyle()}>
        <tbody>
          {this.renderBody()}
        </tbody>
      </table>
    );
  }


  renderList() {
    return (
      <div style={this.getListStyle()} className={CLASS_NAME.LIST_CONTAINER}>
        {this.renderBody(true)}
      </div>
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
    if (this.props.isLoading) {
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
          {this.props.noTable ? this.renderList() : this.renderTable()}
          {this.renderLoadingComponent()}
        </div>
        {this.renderNoRowsMessage()}
      </div>
    );
  }
}


SimianGrid.propTypes = {
  onMoreRowsNeeded : React.PropTypes.func,
  rows             : React.PropTypes.array.isRequired,
  numTotalRows     : React.PropTypes.number.isRequired,
  numBufferRows    : React.PropTypes.number,
  pageSize         : React.PropTypes.number,
  rowHeight        : React.PropTypes.number.isRequired,
  columnDefinition : React.PropTypes.arrayOf(React.PropTypes.shape({
    className: React.PropTypes.string
  })).isRequired
};


module.exports = SimianGrid;
