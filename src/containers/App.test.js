var React = require("react");
var ReactDOM = require("react-dom");
var expect = require("expect");
var TestUtils = require("react-addons-test-utils");

var App = require("./App");

describe("AppContainer", () => {
	it('Should exist', () => {
		expect(App).toExist();
	});
});