var React = require("react");
var ReactDOM = require("react-dom");
var expect = require("expect");
var TestUtils = require("react-addons-test-utils");

import Ball from "./Ball";

describe("Ball", () => {
	it("should exist", () => {
		expect(Ball).toExist();
	});

	describe("render", () => {
		it("should render number to output", () => {
			let ball = TestUtils.renderIntoDocument(<div><Ball number={6} /></div>);
			let actualText = ball.querySelector(".ball span").textContent;
			expect(actualText).toBe("6");
		});

		it("should set ball style to provided", () => {
			let ball = TestUtils.renderIntoDocument(<div><Ball number={6} style={"test"}/></div>);
			let el = ball.querySelector(".ball-test");
			expect(el).toExist();
		});
	});
});