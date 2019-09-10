import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import classNames from "classnames";
import App from "./App";





const defaultOptions = {
	playlist: [
		{
			videoSrc: "assets/img/sing.mp4",
			coverImgSrc: "http://static.srcdn.com/wp-content/uploads/2016/11/Sing-Movie-Animals.jpg",
			title: "The Expanse",
			subtitle: "S2.E3 Static",
			description: "Miller’s plan new plan could change the solar system, while Earth’s fate may be in the hands of an enemy."
		},
		{
			videoSrc: "assets/img/secret-life-of-pets-trailer3.mp4",
			coverImgSrc: "assets/img/secret-life-of-pets-poster.jpg",
			title: "Pets the movie Trailer",
			subtitle: "In Theaters July 8",
			description: "The quiet life of a terrier named Max is upended when his owner takes in Duke, a stray whom Max instantly dislikes."
		}
	],
	initialPlaylistIndex: 0,
	aspectRatio: 1280/692,
	endCardShowTime: 12,
	playNextDelay: 5,
	controlBarHoverTimeout: 2,
	endCardLinks: [
		{
			text: "Some link 1",
			url: "http://blah.com"
		},
		{
			text: "Some link 2",
			url: "http://blah.com"
		}
	]
}




export default class Crisp extends Component {

	static propTypes = {
	}


	constructor(props) {
		super(props);

		this.state = {
			jsonError: false,
			isChanged: false,
			playerOptionsJson: JSON.stringify(defaultOptions, null, 4),
			playerOptions: defaultOptions
		}


		this.generationIndex = 0;
	}

	updateJson = (e) => {
		console.log("Chae?");
		let val=e.target.value;
		this.setState({
			playerOptionsJson: val,
			isChanged: true
		})
	}

	generate = () => {

		if (!this.state.isChanged) {
			return;
		}

		let options;
		try {
			options = JSON.parse(this.state.playerOptionsJson);
		}
		catch (e) {
			this.setState({
				jsonError: true
			});
			return;
		}

		this.generationIndex++;

		this.setState({
			playerOptions: options,
			jsonError: false,
			isChanged: false
		});

	}

	reset = () => {
		this.generationIndex++;
		this.setState({
			jsonError: false,
			isChanged: false,
			playerOptionsJson: JSON.stringify(defaultOptions, null, 4),
			playerOptions: defaultOptions
		})
	}

	render() {

		const options = this.state.playerOptions;
		const optionsJson = this.state.playerOptionsJson;
		const { jsonError, isChanged } = this.state;
		const classnames = classNames({
			'crisp-container': true,
			'crisp--json-error': jsonError,
			'crisp--changed': isChanged
		})
		
		return (
			<div className={classnames}>
				<h1>Crisp player generator</h1>

				<div className="crisp-editor__header">
					<h2>Player options JSON</h2>
					<button className="crisp-button" onClick={this.reset}>Reset to defaults</button>
				</div>
				{
					jsonError ? 
						<div className="crisp__error-msg">
							Whoops, looks like there's a syntax error with your JSON! Please fix and try again.
						</div>
					:
						null
				}
				<textarea className="crisp-textarea" value={optionsJson} onChange={this.updateJson}></textarea>
				<div className="crisp-generate">
					<button className="crisp-generate__button" onClick={this.generate}>Generate player</button>
				</div>
				<div className="crisp-player-wrapper">
					<ReactCSSTransitionGroup transitionName="player" transitionEnterTimeout={1300} transitionLeaveTimeout={1300}> 
						<div className="player" key={this.generationIndex}>
							<div className="crisp-spinner">
								<div className="spinner">
					        <div></div>
					        <div></div>
					        <div></div>
					      </div>
							</div>
							<App {...options} />
						</div>
					</ReactCSSTransitionGroup>
				</div>
			</div>
		)
	}
}