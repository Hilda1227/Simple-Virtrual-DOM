const expect = require('chai').expect;
const vm = require('../src/vm.js');
require('jsdom-global')();
  describe('Test vm', function() {
    it('test vm object', function() {
      var ul = vm('ul', {'class': 'test', key: 1}, [
        vm('li', null, ['li1']),
        vm('li', null, ['li2']),
        vm('li', null, ['li3']),
        vm('li', null, ['li4'])
      ])
      expect(ul.tagName).to.be.equal('ul');
      expect(ul.key).to.be.equal(1);
      expect(ul.count).to.be.equal(4);;
    });

    it('test vm render', function() {
      var dom = vm('ul', {'class': 'test'}, [
        vm('li', null, ['li1']),
        vm('li', null, ['li2']),
        vm('li', null, ['li3']),
        vm('li', null, ['li4'])
      ]).render()

      expect(dom.nodeType).to.be.equal(1);
    });
  });