var watch = require('fs').watch,
    exists = require('fs').existsSync,
    stat = require('fs').statSync,
    util = require('util'),
    Emitter = require('events').EventEmitter;

var FileWatcher = module.exports = function(path) {
  if(!exists(path)) throw new Error("Attempted to watch a file that doesn't exist");
  this._path = path;
  this._directory = stat(path).isDirectory();
  attachWatcher.call(this);
};

function attachWatcher() {
  var self = this;
  this._watcher = watch(this._path, {persistent: true}, function(event, path) {
    if(event == 'rename') {
      setTimeout(function() {
        if(exists(self._path)) {
          if(self._directory) {
            self.emit('add', self._path, self._path + path);
          } else {
            self.emit('change', self._path);
          }
          attachWatcher.call(self);
        } else {
          self.emit('remove', self._path);
        }
      }, 10);
      if(!self._directory) {
        self._watcher.removeAllListeners();
        self._watcher.close();
      }
    } else {
      if(self._directory) {
        self.emit('add', self._path, self._path + path);
      } else {
        self.emit('change', self._path);
      }
    }
  });
}

util.inherits(FileWatcher, Emitter);
