# simian-grid

Yet another react grid component.

Props:
- noTable: false by default, set this to true in order to render a series of div elements instead of a table.
- numTotalRows: The number of total rows in the system. This is used to size the containers appropriately in order to give the illusion all data being available.
- numBufferRows: The number of buffer rows to keep above and below the visible window. This comes with sane defaults but you can tweak this to fine tune performance.
- pageSize: Number of rows to ask for while loading more data.
- rowHeight: This is a required property and corresponds to the height of a single row. Note that simian-grid only supports all rows to be of the same height.
- columnDefinition: Only requiredAn array of objects with each describing a single column. This is required when rendering a table and must have as many objects as there are columns.
- events: A map of the form <eventName: String, handler: function>. We will wire all the events and handlers as described in the map to one of the grid wrappers.
- rowNumber: Optionally, use this to position the grid to show <rowNumber> at the top. Useful when re-ordering / changing data.
- isLoading: Optional. False by default. Causes the grid to show a loading message.
- onMoreRowsNeeded: Required. A function of the form function(from, howMany) {} that is used to signal the need for <howMany> items starting at <from>. This used to signal the container component that the grid needs more data.
- rows: Required.
  When rendering a table, this needs to be an array of arrays of the form [rowNumber][cellNumber]. i.e., as many array elements as there are rows, and as many elements in each row as there are columns. The contents of the inner array may be a string / number / component in which case they will be rendered as a child of td elements. Or, an object containing an __html:String property, in which case __html will be set as the innerHTML of each td.

  When rendering a list, this needs to be an array of strings / numbers / components. These will be rendered as child of a series of divs. The array contents might also be objects containing an __html property in which case __html will be set as the innerHTML of the corresponding row div.


### Current state and open issues

- The demo page scrolls through ~~a million rows~~ almost a million rows easily. Well actually any number of rows which you can fit within 33554428 pixels; that is the maximum height of a div in Chrome; I have some ideas on how to fix this issue, but that fix will come later.
- FireFox seems to ignore the height attribute if it past a certain number; This means that in FF the scrollbar starts out as bif and gets smaller as more rows are loaded.


### Breaking changes in 0.2.0

- props.getRowsFunction is no longer supported. simian-grid will always look use props.rows for data. There is a new prop 'onMoreRowsNeeded'. A function, this will be called every time simian-grid runs out of data to display. You can choose to use this callback to fetch data.

### Goodies in 0.3.0
- While using simian-grid I realised that performance fell alarmingly once I started supplying components to be nested inside cells. To get around this, you can now specify raw HTML as string to be set inside cells (or list rows) via dangerouslySetInnerHTML. Use custom attributes and the props.events map to intercept events.


### How to build example

```
$ npm install
$ gulp demo
$ open demo/index.html
```

### How to use in your own project

You can use simian-grid in your own project by installing it thus,

```
$ npm install simian-grid --save-dev
```
But I strongly advise you look at a more mature solution like Griddle. simian-grid is still in development and it is very limited in functionality. Watch the repo, or my twitter account @SimiaCode for updates. If you find a bug, of if you have a feature request, please log an issue at https://github.com/akshat1/simian-grid/issues.


### Notes

Manage column widths using css as you would with any table; The header row is a tr, with the extra .header styleclass. Table striping enabled by even/odd styleclasses on rows. See the included demo.js for example usage.
