const NUM_BUFFER_ROWS = 10;
const DEFAULT_PAGE_SIZE = 60;
const OUTER_WRAPPER_STYLE = {
  overflow : 'auto',
  height   : '100%',
  width    : '100%'
};

const NO_ROWS_COMPONENT_STYLE = {
  whiteSpace : 'nowrap',
  position   : 'absolute',
  fontSize   : '5em',
  top        : '50%',
  left       : '50%',
  transform  : 'translate(-50%, -50%)'
};

const CLASS_NAME = {
  OUTER_WRAPPER     : 'simiangrid-wrapper',
  INNER_WRAPPER     : 'simiangrid-inner-wrapper',
  LIST_CONTAINER    : 'simian-grid-list-container',
  EVEN              : 'even',
  ODD               : 'odd',
  HEADER_ROW        : 'header',
  DUMMY             : 'dummy',
  OUTER_WRAPPER     : 'simiangrid-wrapper',
  NO_ROWS_COMPONENT : 'simian-grid-no-rows-component',
  LOADING_COMPONENT : 'simian-grid-loading-component',
  LIST_ROW          : 'simian-grid-list-row'
};

const REF_NAME = {
  OUTER_WRAPPER : 'outer-wrapper',
  INNER_WRAPPER : 'inner-wrapper'
};


module.exports = {
  NUM_BUFFER_ROWS,
  DEFAULT_PAGE_SIZE,
  OUTER_WRAPPER_STYLE,
  NO_ROWS_COMPONENT_STYLE,
  CLASS_NAME,
  REF_NAME
};
