var expect = require('expect.js'),
    fs = require('fs');

var Ogle = require('..');

describe.only("Ogle", function() {

  var testFile = __dirname + '/fixtures/test.txt',
      testDir = __dirname + '/fixtures/testDir/';

  describe("constructor", function() {
    it("returns an Ogle instance", function() {
      var ogle = new Ogle();
      expect(ogle).to.be.a(Ogle);
    });

    it("taks an optional 'all' listener callback", function() {
      var ogle = new Ogle(undefined, function() { });
      expect(ogle._events.all).to.be.ok();
    });

    it("assigns listeners for the glob", function() {
      var ogle = new Ogle(testFile);
      expect(Object.keys(ogle._watchers)).to.have.length(1);
    });
  });

  describe("events", function() {
    describe('all', function() {
      it("emits on 'change'", function(done) {
        var ogle = new Ogle(testFile);
        ogle.once('all', function(event, path) {
          expect(event).to.be('change');
          expect(path).to.be(testFile);
          done();
        });
        fs.writeFile(testFile, 'blah');
      });

      it("emits on 'remove'", function(done) {
        var ogle = new Ogle(testFile);
        ogle.once('all', function(event, path) {
          expect(event).to.be('remove');
          expect(path).to.be(testFile);
          fs.writeFile(testFile, 'blah', done);
        });
        fs.unlink(testFile, function() { });
      });

      it("emits on 'add'", function(done) {
        var ogle = new Ogle(testDir);
        ogle.once('all', function(event, path, newPath) {
          expect(event).to.be('add');
          expect(newPath).to.be(testDir + 'someFile.txt');
          fs.unlink(testDir + '/someFile.txt', done);
        });
        fs.writeFile(testDir + '/someFile.txt', 'blah');
      });
    });

    it("emits 'add' event", function(done) {
        var ogle = new Ogle(testDir);
        ogle.once('add', function(path, newPath) {
          expect(newPath).to.be(testDir + 'someFile.txt');
          fs.unlink(testDir + '/someFile.txt', done);
        });
        fs.writeFile(testDir + 'someFile.txt', 'blah');
    });

    it("emits 'change' event", function(done) {
      var ogle = new Ogle(testFile);
      ogle.once('change', function(path) {
        expect(path).to.be(testFile);
        done();
      });
      fs.writeFile(testFile, 'blah');
    });

    it("emits 'remove' event", function(done) {
        var ogle = new Ogle(testFile);
        ogle.once('remove', function(path) {
          expect(path).to.be(testFile);
          fs.writeFile(testFile, 'blah', done);
        });
        fs.unlink(testFile, function() { });
    });

    it("adds listeners to new files in dir", function(done) {
      var ogle = new Ogle(testDir);
      ogle.once('change', function(path) {
        expect(path).to.be(testDir + 'someFile.txt');
        fs.unlink(testDir + 'someFile.txt', done);
      });
      fs.writeFile(testDir + 'someFile.txt', 'blah', function() {
        setTimeout(function() {
          fs.writeFile(testDir + 'someFile.txt', 'blah blah');
        }, 300);
      });
    });

  });

  describe('#add', function() {
    it("attaches appropriate listeners", function() {
      var ogle = new Ogle();
      ogle.add(testFile);
      expect(Object.keys(ogle._watchers)).to.have.length(1);
    });
  });

  describe('#remove', function() {
    it('removes the listeners', function() {
      var ogle = new Ogle();
      ogle.add(testFile);
      ogle.remove(testFile);
      expect(Object.keys(ogle._watchers)).to.have.length(0);
    });
  });
});
