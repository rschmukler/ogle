# Ogle

Thin wrapper for `fs.watch` with glob-pattern matching.

## Example

As a function:

```js
Ogle(['lib/some-dir/', 'lib/some-dir/*.js'], function(event, path, otherPath) {
  switch(event) {
    case 'add':
      console.log("File %s added to directory %s", path, otherPath);
      break;
    case 'change':
      console.log("File %s changed", path);
      break;
    case 'remove':
      console.log("File %s deleted", path);
      break;
  }
});
```

Or an instance: 

```js
var watcher = new Ogle(['lib/some-dir/', 'lib/some-dir/*.js']);

watcher.on('add', function(dir, newFile) {
  console.log("File %s added to directory %s", newFile, dir);
});

watcher.on('change', function(filePath) {
  console.log("File %s changed", filePath);
});

watcher.on('remove', function(filePath) {
  console.log("File %s was deleted", filePath);
});

watcher.on('all', function(event, filePath, otherPath) {
  switch(event) {
    case 'add':
      console.log("File %s added to directory %s", filePath, otherPath);
      break;
    case 'change':
      console.log("File %s changed", filePath);
      break;
    case 'remove':
      console.log("File %s deleted", filePath);
      break;
  }
});
```

## Why?

There are already many wrappers on `fs.watch`/`fs.watchFile`. Unfortunately, non
of them seemed to be usable without making sacrifices. Ogle chooses the
following advantages:

- glob pattern matching
- `all/remove/change` events on files
- `all/add/remove/change` events on directories
- Auto-adding of listeners for new files in directories (if we are watching the
  directory)
- Use of `fs.watch` instead of `fs.watchFile`. See [here for
  why](http://tech.nitoyon.com/en/blog/2013/10/10/grunt-watch-slow/).

## Complete documentation

Coming soon...
