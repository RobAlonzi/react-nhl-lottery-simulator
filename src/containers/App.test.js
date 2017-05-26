var React = require("react");
let ReactDOM = require("react-dom");
var expect = require("expect");
var TestUtils = require("react-addons-test-utils");
import { render, shallow } from 'enzyme';

import App from "./App";

describe("AppContainer", () => {
	it('Should exist', () => {
		expect(App).toExist();
	});

	it('Should not render winners list if no winners ', () => {
		let app = render(<App />);
		let winnerList = app.find(".winner-list").get().length;

		expect(winnerList).toBe(0);
	});

	it('Should not render balls drawn list if no balls drawn', () => {
		let app = render(<App />);
		let ballsList = app.find(".lottery-balls").get().length;

		expect(ballsList).toBe(0);
	});

	it('Should not render odds table heading if lottery over', () => {
		let app = shallow(<App />);
		app.setState({lotteryOver: true});
		let tableHeading = app.find("h2").get();

		expect(tableHeading).toNotExist();
	});

});