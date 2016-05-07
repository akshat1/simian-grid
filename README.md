# simian-grid

Yet another react grid component.

Props:
- onMoreRowsNeeded function(beginIndex, numItems){} // signal the need for more rows
- rows []               // an array of rows, with each row being an array itself
- numTotalRows          // total rows in the system. We use this to setup scrolling. Needed this for lazy loading (WIP)
- columnDefinition [{}] // contains information about each column {title, className}
- rowHeight             // px height of each row; For now, this must be fixed and same for all rows
- numBufferRows         // number of rows to keep as scroll buffer on either side of the viewport. Optional. default 10
- pageSize              // number of rows to request each time more rows are requested. Optional. default 60


### Current state and open issues

- The demo page scrolls through ~~a million rows~~ almost a million rows easily. Well actually any number of rows which you can fit within 33554428 pixels; that is the maximum height of a div in Chrome; I have some ideas on how to fix this issue, but that fix will come later.
- FireFox seems to ignore the height attribute if it past a certain number; This means that in FF the scrollbar starts out as bif and gets smaller as more rows are loaded.


### Breaking changes in 0.1.0

- props.rows is no longer supported. simian-grid will always look to fetch data through props.getRowsFunction.


### In the pipeline

- Supply custom column header elements
- Supply custom cell component elements


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
