'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var autobind = require('autobind-decorator');
var _ = require('lodash');


var ROW_HEIGHT = 40;
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
    /*
    //Scroll amount is deltaY; TODO: Look at deltaMode
    let delta       = event.deltaY;
    let numNewRows  = Math.floor(delta / ROW_HEIGHT);
    let state       = this.state;
    let props       = this.props;
    let tableTopPos = this.refs['outerWrapper'].scrollTop;
    let newIndex    = state.currentIndex + numNewRows;
    //console.log('delta: ', delta);
    if (delta > 0) {
      //console.log(0);
      // Scroll downwards
      this.setState({
        currentIndex : newIndex,
        tableTopPos  : tableTopPos
      });
    } else {
      //console.log(1);
      if (newIndex > 0) {
        this.setState({
          currentIndex : newIndex,
          tableTopPos  : tableTopPos
        });
      }
    }
    */

    let wrapper = this.refs['outerWrapper'];
    let scrollTop = wrapper.scrollTop;
    let newIndex = Math.floor(scrollTop / ROW_HEIGHT);
    this.setState({
      currentIndex : newIndex,
      tableTopPos  : newIndex > NUM_BUFFER_ROWS ? scrollTop - (NUM_BUFFER_ROWS * ROW_HEIGHT) : scrollTop
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
    let height = this.props.numTotalRows * ROW_HEIGHT;
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
    return;
  }


  @autobind
  renderBody() {
    let state = this.state;
    let props = this.props;
    let rows = props.rows;
    let renderedRows = [];
    let lb = state.currentIndex;
    let ub = lb + props.cursorSize + NUM_BUFFER_ROWS;
    if (lb > NUM_BUFFER_ROWS)
      lb = lb - NUM_BUFFER_ROWS;
    for (let i = lb; i < ub; i++) {
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
        {this.renderHead()}
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
