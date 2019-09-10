import React, { Component, PropTypes } from 'react';
import ProgressBarPreview from './ProgressBarPreview';

export default class ProgressBar extends Component {

	static propTypes = {
		isScrubbing: PropTypes.bool,
		isPlaying: PropTypes.bool,
		onChange: PropTypes.func,
		duration: PropTypes.number,
		currentTime: PropTypes.number,
		videoSrc: PropTypes.string
	}

	constructor(props) {
		super(props);
		this.state = {
			isHovering: false,
			hoveredTimePoint: 0
		}
	}

	componentDidMount() {
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mouseup', this.onStopHandleDrag);
	}

	componentWillUnmount() {
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('mouseup', this.onStopHandleDrag);		
	}

	getTimeFromMousePos(x) {
		let rect = this.slider.getBoundingClientRect();
		let left = x - rect.left;
		let time = (left/this.slider.offsetWidth) * this.props.duration;
		time = Math.max(time, 0);
		time = Math.min(time, this.props.duration);
		return time;
	}

	onStartHandleDrag = (e) => {
		e.preventDefault();
		let time = this.getTimeFromMousePos(e.pageX);
		this.props.onChange(time, true);

	}

	onStopHandleDrag = (e) => {
		if (this.props.isScrubbing) {
			let time = this.getTimeFromMousePos(e.pageX);
			this.props.onChange(time, false);
		}

		//document.body.removeEventListener('mousemove', this.onMouseMove);
		//document.body.removeEventListener('mouseup', this.onStopHandleDrag);
	}

	onMouseMove = (e) => {
		if (this.state.isHovering || this.props.isScrubbing) {
			let time = this.getTimeFromMousePos(e.pageX);
			this.setState({
				hoveredTimePoint: time
			})
			if (this.props.isScrubbing) {
				e.preventDefault();
				this.props.onChange(time);
			}
		}
	}

	onMouseOver = (e) => {
		this.setState({
			isHovering: true
		})
	}

	onMouseOut = (e) => {
		this.setState({
			isHovering: false
		})
	}

	render() {

		const { currentTime, duration, isScrubbing, videoSrc } = this.props;
		const { isHovering } = this.state;

		// Makes sure we update the position of the preview whether we are just hovering or if we
		// are scrubbing (which may not be the same as hovering since you can drag from outside the bar)
		//const hoveredTimePoint = isScrubbing ? currentTime : this.state.hoveredTimePoint;
		const hoveredTimePoint = this.state.hoveredTimePoint;
		const timePercent = hoveredTimePoint/duration;

		const styleLeft = ((currentTime/duration) * 100) + "%";

		return (
			<div className="progress-bar" onMouseDown={this.onStartHandleDrag} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} ref={(el)=>{this.slider=el}}>
				<div className="progress-bar__past"
					style={{ width: styleLeft }}>
				</div>
				<div className="progress-bar__handle"
					style={{ left: styleLeft }}>
				</div>
				<ProgressBarPreview 
					timePoint={hoveredTimePoint} 
					timePercent={timePercent}
					show={isScrubbing || isHovering }
					videoSrc={videoSrc}
				/>
			</div>
		)
	}
}