# simian-grid

Yet another react grid component.

Props:
- rows[][]              // where each row is an array of cells
- numTotalRows          // total rows in the system. We use this to setup scrolling. Needed this for lazy loading (WIP)
- columnDefinition [{}] // contains information about each column {title, className}
- rowHeight             // px height of each row; For now, this must be fixed and same for all rows


### Current state

The demo page scrolls through a million rows easily.

### Coming features

- Lazy loading / infinite-scrolling.
- Publish simian-grid to npm

### How to build example

```
$ npm install
$ gulp build
$ open dist/index.html
```

### Notes

Manage column widths using css as you would with any table; The header row is a tr, with the extra .header styleclass. Table striping enabled by even/odd styleclasses on rows. See the included main.js for a demonstration.
