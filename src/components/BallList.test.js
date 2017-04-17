var React = require("react");
var expect = require("expect");
import { render } from 'enzyme';

import BallList from "./BallList";

describe("BallList", () => {
	it("should exist", () => {
		expect(BallList).toExist();
	});

	describe("render", () => {
		it("should render correct amount of Ball components", () => {
			let ballListData = {
				balls: [1, 2, 6],
				style: "default"
			};

			let ballList = render(<BallList {...ballListData} />);
			let balls = ballList.find(".ball").get().length;
			expect(balls).toEqual(ballListData.balls.length);
		});
	});
});


