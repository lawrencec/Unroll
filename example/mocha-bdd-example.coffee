chai = require 'chai'
expect = chai.expect
require 'sinon-chai'
unroll = require '../index.js'

describe "feature", ->
  it "maximum of two numbers", ->
    expect(Math.max(3, 5)).to.equal 5;
    expect(Math.max(7, 0)).to.equal 7;


describe "feature", ->
  unroll "maximum of #a and #b is #c", (done, testArgs) ->
      expect(Math.max(testArgs.a, testArgs.b)).to.be.equal testArgs.c
      done()
    ,
    [
      ['a', 'b', 'c'],
      [ 3,   5,   5 ],
      [ 7,   0,   7 ]
    ]
