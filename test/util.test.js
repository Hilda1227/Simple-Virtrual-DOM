const expect = require('chai').expect;

const util = require('../src/util.js');
describe('Test util', function() {
  it('test isArray function', function() {
    expect(util.isArray([])).to.be.true;
    expect(util.isArray({})).to.be.false;
  });

  it('test isString function', function() {
    expect(util.isString('')).to.be.true;
    expect(util.isString({})).to.be.false;
  });

});