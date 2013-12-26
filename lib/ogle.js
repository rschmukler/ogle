var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    globule = require('globule'),
    FileWatcher = require('./file-watcher.js');

function Ogle(glob, cb) {
  if(!(this instanceof Ogle)) return new Ogle(glob, cb);
  var self = this;

  this._watchers = {};

  this.add(glob);
  this.on('add', function(path, newPath) {
    self.add(newPath);
  });
  if(cb) this.on('all', cb);
}

util.inherits(Ogle, EventEmitter);

Ogle.prototype.add = function(glob) {
  if(!glob) return;

  var files = globule.find(glob);

  for(var i = 0, path; path = files[i]; ++i) {
    this._watchers[path] = buildWatcher.call(this, path);
  }
};

Ogle.prototype.remove = function(glob) {
  if(!glob) return;

  var files = globule.find(glob);

  for(var i = 0, path; path = files[i]; ++i) {
    this._watchers[path].removeAllListeners();
    delete this._watchers[path];
  }
};

module.exports = Ogle;


function buildWatcher(path) {
  var watcher = new FileWatcher(path),
      self = this;

  watcher.on('add', function(path, newPath) {
    self.emit('all', 'add', path, newPath);
    self.emit('add', path, newPath);
  });

  watcher.on('change', function(path) {
    self.emit('all', 'change', path);
    self.emit('change', path);
  });

  watcher.on('remove', function(path) {
    self.emit('all', 'remove', path);
    self.emit('remove', path);
  });

  return watcher;
}
