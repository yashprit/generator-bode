'use strict';<% if ( props.unit['node_unit'] ) { %>
exports['truth is true'] = {
  setUp: function(done) {
    done();
  },
  'truth': function(test) {
    test.expect(1);
    test.ok(true, "Truth is true!");
    test.done();
  }
};
<% } else if( props.unit['mocha_chai'] ) { %>
var expect = require("chai").expect;

describe("truth is true", function() {
  it("truth", function() {
    expect(true).to.be.true;
  });
});
<% } else if( props.unit['jasmine'] ) { %>
describe("truth is true", function() {
  it("truth", function() {
    expect(true).toBe(true);
  });
});
<% } %>