import React, { Component, PropTypes } from 'react';

export default class CCDialog extends Component {

	static propTypes = {
		onClickSettings: PropTypes.func
	}


	constructor(props) {
		super(props);
	}

	onClickSettings = (e) => {
		console.log("on click settings");
		this.props.onClickSettings();
	}

	render() {

		return (
			<div className="cc-dialog">
				<div className="cc-dialog__title">Closed Captions</div>
				<ul className="cc-dialog__languages">
					<li className="active">Off</li>
					<li>English</li>
				</ul>
				<ul className="cc-dialog__settings">
					<li onClick={this.onClickSettings}><i className="fa fa-cog"></i>Settings</li>
				</ul>
			</div>
		)
	}
}