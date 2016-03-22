'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var autobind = require('autobind-decorator');
var _ = require('lodash');


var NUM_BUFFER_ROWS = 30;


class SimianGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex : 0,
      tableTopPos  : 0
    };
  }


  componentDidMount() {
    // wheel
    this.refs['outerWrapper'].addEventListener('scroll', _.debounce(this.handleScroll, 5));
  }


  @autobind
  handleScroll(event) {
    let wrapper = this.refs['outerWrapper'];
    let scrollTop = wrapper.scrollTop;
    let rowHeight = this.props.rowHeight;
    let newIndex = Math.floor(scrollTop / rowHeight);
    this.setState({
      currentIndex : newIndex,
      tableTopPos  : newIndex > NUM_BUFFER_ROWS ? scrollTop - (NUM_BUFFER_ROWS * rowHeight) : scrollTop
    });
  }


  getOuterWrapperStyle() {
    return {
      height     : '390px',
      width      : '600px',
      border     : '1px solid black',
      margin     : '50px',
      background : '#E9E9E9',
      overflow   : 'auto'
    };
  }


  getInnerWrapperStyle() {
    let height = this.props.numTotalRows * this.props.rowHeight;
    return {
      position : 'relative',
      height   : height
    };
  }


  getTableStyle() {
    return {
      top: this.state.tableTopPos
    }
  }


  @autobind
  renderCell(data, index) {
    return (
      <td key={index}>
        {data}
      </td>
    );
  }

  @autobind
  renderRow(row, index) {
    return (
      <tr key={index}>
        {row.map(this.renderCell)}
      </tr>
    );
  }


  @autobind
  renderHead(){
    let columnDefinition = this.props.columnDefinition;
    // Let us assume this function is ONLY called if columnDefinition is truthy
    let cells = columnDefinition.map(function(colDef, index) {
      return (
        <td className={colDef.className} key={`header-cell-${index}`}>
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
    let rows = props.rows;
    let renderedRows = [];
    let currentIndex = this.state.currentIndex;
    let lb = currentIndex;
    let ub = lb + props.cursorSize + NUM_BUFFER_ROWS - 1; // -1 for the header
    let headerRowIndex = currentIndex;
    if (lb > NUM_BUFFER_ROWS) {
      lb = lb - NUM_BUFFER_ROWS;
    }
    for (let i = lb; i < ub; i++) {
      if (i === headerRowIndex)
        renderedRows.push(this.renderHead());
      renderedRows.push(this.renderRow(rows[i], i));
    }
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
      <div style={this.getOuterWrapperStyle()} className='simiangrid-wrapper' ref='outerWrapper'>
        <div style={this.getInnerWrapperStyle()} className='simiangrid-inner-wrapper'>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}


module.exports = SimianGrid;
