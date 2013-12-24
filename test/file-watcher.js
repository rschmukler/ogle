var expect = require('expect.js'),
    fs = require('fs');

var FileWatcher = require('../lib/file-watcher.js');

describe("File Watcher", function() {
  var watcher;

  before(function() {
    watcher = new FileWatcher(__dirname + '/fixtures/test.txt');
  });

  it('throws an error if file doesnt exist', function() {
    try {
      watcher = new FileWatcher('./fixtures/not-real.txt');
      throw new Error("Should not reach here");
    } catch(e) {
      expect(e.message).to.be("Attempted to watch a file that doesn't exist");
    }
  });

  it("emits changed events");
  it("emits renamed events");
  it("reattaches listeners on rename");
});
