# simian-grid

Yet another react grid component.

Props:
- rows[][]              // where each row is an array of cells
- numTotalRows          // total rows in the system. We use this to setup scrolling. Needed this for lazy loading (WIP)
- columnDefinition [{}] // contains information about each column {title, className}
- rowHeight             // px height of each row; For now, this must be fixed and same for all rows


### Current state

The demo page scrolls through a million rows easily on Chrome. On Firefox, we only generate 100,000 random rows as a million rows never seem to finish being generated there. And Safari for some reason does not scroll as smoothly as FF or Chrome for any number of rows.

### Coming features

- Lazy loading / infinite-scrolling.
- Publish simian-grid to npm

### How to build example

```
$ npm install
$ gulp demo
$ open demo/index.html
```

### Notes

Manage column widths using css as you would with any table; The header row is a tr, with the extra .header styleclass. Table striping enabled by even/odd styleclasses on rows. See the included main.js for a demonstration.
