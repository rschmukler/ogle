var expect = require('expect.js'),
    fs = require('fs');

var Ogle = require('..');

describe("Ogle", function() {

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
      ogle.stop();
    });
  });

  describe("events", function() {
    describe('all', function() {
      it("emits on 'change'", function(done) {
        var ogle = new Ogle(testFile);
        ogle.once('all', function(event, path) {
          ogle.stop();
          expect(event).to.be('change');
          expect(path).to.be(testFile);
          done();
        });
        fs.writeFile(testFile, 'blah');
      });

      it("emits on 'remove'", function(done) {
        var ogle = new Ogle(testFile);
        ogle.once('all', function(event, path) {
          ogle.stop();
          expect(event).to.be('remove');
          expect(path).to.be(testFile);
          fs.writeFile(testFile, 'blah', done);
        });
        fs.unlink(testFile, function() { });
      });

      it("emits on 'add'", function(done) {
        var ogle = new Ogle(testDir);
        ogle.once('all', function(event, path, newPath) {
          ogle.stop();
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
          ogle.stop();
          expect(newPath).to.be(testDir + 'someFile.txt');
          fs.unlink(testDir + '/someFile.txt', done);
        });
        fs.writeFile(testDir + 'someFile.txt', 'blah');
    });

    it("emits 'change' event", function(done) {
      var ogle = new Ogle(testFile);
      ogle.once('change', function(path) {
        ogle.stop();
        expect(path).to.be(testFile);
        done();
      });
      fs.writeFile(testFile, 'blah');
    });

    it("emits 'remove' event", function(done) {
        var ogle = new Ogle(testFile);
        ogle.once('remove', function(path) {
          ogle.stop();
          expect(path).to.be(testFile);
          fs.writeFile(testFile, 'blah', done);
        });
        fs.unlink(testFile, function() { });
    });


    describe("Adding new listeners", function() {
      var ogleAll, ogleJs;

      beforeEach(function(done) {
        ogleJs = new Ogle([testDir, testDir + '*.js']),
        ogleAll = new Ogle([testDir, testDir + '*']);

        setTimeout(function() {
          fs.writeFile(testDir + 'someFile.txt', 'blah', function() {
            fs.writeFile(testDir + 'someFile.js', 'blah blah', done);
          });
        }, 10);
      });

      afterEach(function(done) {
        fs.unlink(testDir + 'someFile.txt', function() {
          fs.unlink(testDir + 'someFile.js', done);
        });
      });

      it("adds listeners to files", function(done) {
        ogleAll.once('change', function(path) {
          ogleAll.stop();
          done();
        });
        fs.writeFile(testDir + 'someFile.txt', 'blah blah');
      });

      it("only adds files that match the regex", function(done) {
        ogleJs.once('change', function(path) {
          ogleJs.stop();
          expect(path).to.be(testDir + 'someFile.js');
          done();
        });
        fs.writeFile(testDir + 'someFile.txt', 'blah blah', function() {
          fs.writeFile(testDir + 'someFile.js', 'blah blah', function() {
          });
        });
      });
    });
  });

  describe('#start', function() {
    it("adds listeners for the glob", function() {
      var ogle = new Ogle(testFile);
      ogle.stop();
      expect(Object.keys(ogle._watchers)).to.have.length(0);
      ogle.start();
      expect(Object.keys(ogle._watchers)).to.have.length(1);
    });
  });

  describe('#stop', function() {
    it("removes all listeners", function() {
      var ogle = new Ogle(testFile);
      expect(Object.keys(ogle._watchers)).to.have.length(1);
      ogle.stop();
      expect(Object.keys(ogle._watchers)).to.have.length(0);
    });
  });

  describe('#add', function() {
    it("attaches appropriate listeners", function() {
      var ogle = new Ogle();
      ogle.add(testFile);
      expect(Object.keys(ogle._watchers)).to.have.length(1);
      ogle.stop();
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
