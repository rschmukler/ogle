var expect = require('expect.js'),
    fs = require('fs');

var FileWatcher = require('../lib/file-watcher.js');

describe("File Watcher", function() {
  var watcher,
      testFile = __dirname + '/fixtures/test.txt',
      testDir = __dirname + '/fixtures/testDir/';



  it('throws an error if file doesnt exist', function() {
    var makeWatcher = function() {
      watcher = new FileWatcher('./fixtures/not-real.txt');
    };
    expect(makeWatcher).to.throwError("Attempted to watch a file that doesn't exist");
  });

  describe("files", function() {
    beforeEach(function() {
      watcher = new FileWatcher(testFile);
    });

    it("doesn't set itself as a directory", function() {
      expect(watcher._directory).to.be(false);
    });

    it("emits 'change' events", function(done) {
      watcher.once('change', function(path) {
        expect(path).to.be(testFile);
        done();
      });
      fs.writeFile(testFile, 'wee');
    });

    it("emits 'remove' events", function(done) {
      watcher.once('remove', function(path) {
        expect(path).to.be(testFile);
        fs.writeFile(testFile, 'wee', done);
      });
      fs.unlink(testFile, 'wee');
    });
  });

  describe("directories", function() {

    beforeEach(function() {
      watcher = new FileWatcher(testDir);
    });

    it("emits 'add' events", function(done) {
      watcher.once('add', function(dir, newFile) {
        expect(dir).to.be(testDir);
        expect(newFile).to.be(testDir + 'newFile.txt');
        fs.unlink(testDir + 'newFile.txt', done);
      });
      fs.writeFile(testDir + 'newFile.txt');
    });
  });
});
