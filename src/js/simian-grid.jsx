'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var autobind = require('autobind-decorator');
var _ = require('lodash');
var setupResizeHandling = require('element-resize-event');


var NUM_BUFFER_ROWS = 10;

var OUTER_WRAPPER_STYLE = {
  overflow: 'auto',
  height: '100%',
  width: '100%'
};


class SimianGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex : 0,
      tableTopPos  : 0,
      cursorSize   : 10
    };
  }


  setUpEventListeners() {
    let outerWrapper = this.refs['outerWrapper'];
    // wheel
    outerWrapper.addEventListener('scroll', this.handleScroll);
    setupResizeHandling(outerWrapper, _.debounce(this.handleResize, 50));
  }


  @autobind
  updateSelf() {
    let cursorSize = Math.floor(this.refs['outerWrapper'].clientHeight / this.props.rowHeight) - 1; //-1 for header
    let maxLB = this.props.rows.length - (NUM_BUFFER_ROWS + cursorSize);
    this.setState({
      innerWrapperHeight: this.props.numTotalRows * this.props.rowHeight,
      maxLB: maxLB,
      cursorSize: cursorSize
    });
  }


  componentWillReceiveProps(nextProps) {
    this.updateSelf();
  }


  componentDidMount() {
    this.setUpEventListeners();
    this.updateSelf();
  }


  @autobind
  handleScroll(event) {
    let wrapper = this.refs['outerWrapper'];
    let scrollTop = wrapper.scrollTop;
    let rowHeight = this.props.rowHeight;
    let newIndex = Math.floor(scrollTop / rowHeight);
    let availRows = this.props.rows.length;
    let tableTopPos = newIndex > NUM_BUFFER_ROWS ? scrollTop - (NUM_BUFFER_ROWS * rowHeight) : scrollTop - (newIndex * rowHeight)
    this.setState({
      currentIndex : newIndex,
      tableTopPos  : tableTopPos
    });
  }


  @autobind
  handleResize() {
    this.updateSelf();
  }


  getInnerWrapperStyle() {
    return {
      height: this.state.innerWrapperHeight,
      position: 'relative',
      overflow: 'hidden'
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


  getTableStyle() {
    return {
      top: this.state.tableTopPos,
      borderCollapse: 'collapse',
      width: '100%',
      position: 'absolute'
    }
  }


  @autobind
  renderCell(data, index) {
    return (
      <td key={index} style={this.getCellStyle()}>
        {data}
      </td>
    );
  }


  @autobind
  renderRow(row, index) {
    let evenOdd = index % 2 === 0 ? 'even' : 'odd';
    return (
      <tr key={index} className={evenOdd}>
        {row.map(this.renderCell)}
      </tr>
    );
  }


  @autobind
  renderHead(){
    let columnDefinition = this.props.columnDefinition;
    let style = this.getCellStyle();
    // Let us assume this function is ONLY called if columnDefinition is truthy
    let cells = columnDefinition.map(function(colDef, index) {
      return (
        <td className={colDef.className} key={`header-cell-${index}`} style={style}>
          {colDef.title}
        </td>
      );
    });
    return (
      <tr className='header' key='header-row'>
        {cells}
      </tr>
    );
  }


  @autobind
  renderBody() {
    let props = this.props;
    let state = this.state;
    let rows = props.rows;
    let renderedRows = [];
    let currentIndex = state.currentIndex;
    let lb = currentIndex;
    let cursorSize = state.cursorSize;
    let maxLB = state.maxLB;
    if (lb > maxLB)
      lb = maxLB;
    let ub = lb + cursorSize + 2 * NUM_BUFFER_ROWS;
    let headerRowIndex = currentIndex < NUM_BUFFER_ROWS ? currentIndex : NUM_BUFFER_ROWS;
    let headerRow = this.renderHead();
    for (let i = lb; i < ub; i++) {
      let row = rows[i];
      if (!row)
        break;
      renderedRows.push(this.renderRow(rows[i], i));

    }
    renderedRows.splice(headerRowIndex, 0, headerRow);
    return (
      <tbody>
        {renderedRows}
      </tbody>
    );
  }


  @autobind
  renderTable() {
    return (
      <table style={this.getTableStyle()}>
        {this.renderBody()}
      </table>
    );
  }


  render() {
    return (
      <div className='simiangrid-wrapper' ref='outerWrapper' style={OUTER_WRAPPER_STYLE}>
        <div style={this.getInnerWrapperStyle()} className='simiangrid-inner-wrapper'>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}


module.exports = SimianGrid;
