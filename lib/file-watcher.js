var watch = require('fs').watch;

var FileWatcher = module.exports = function(path) {
  try {
    this._watcher = watch(path, {persistent: true});
  } catch(e) {
    throw new Error("Attempted to watch a file that doesn't exist");
  }
};
