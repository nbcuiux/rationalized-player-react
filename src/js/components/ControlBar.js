import React, { Component, PropTypes } from 'react';
import ProgressBar from './ProgressBar';
import HoverDialog from './HoverDialog';
import VolumeControl from './VolumeControl';
import NextDialog from './NextDialog';
import CCDialog from './CCDialog';

import { formatTime } from '../client/utils';

export default class ControlBar extends Component {

	static propTypes = {
		isScrubbing: PropTypes.bool,
		isPlaying: PropTypes.bool,
		onTogglePlay: PropTypes.func,
		onStartHandleDrag: PropTypes.func,
		currentTime: PropTypes.number,
		duration: PropTypes.number,
		volume: PropTypes.number,
		onVolumeChanged: PropTypes.func,
		onStartVolumeDrag: PropTypes.func,
		isVolumeDragging: PropTypes.bool,
		onToggleFullScreen: PropTypes.func,
		onClickCCSettings: PropTypes.func,
		videoSrc: PropTypes.string,
		nextPlaylistItem: PropTypes.object,
		goToNextPlaylistItem: PropTypes.func
	}


	constructor(props) {
		super(props);
	}

	onTogglePlay = (e) => {
		e.stopPropagation();
		this.props.onTogglePlay();
	}

	onToggleVolume = (e) => {
		e.stopPropagation();
		if (this.props.volume > 0.5) {
			this.props.onVolumeChanged(0, false);
		}
		else {
			this.props.onVolumeChanged(1, false);
		}
	}

	render() {

		const { 
			onTogglePlay, 
			currentTime, 
			duration, 
			volume, 
			isVolumeDragging, 
			onScrubberChanged, 
			onVolumeChanged, 
			isScrubbing,
			onClickCCSettings,
			videoSrc,
			nextPlaylistItem,
			goToNextPlaylistItem
		} = this.props;

		const volumeDialog = <VolumeControl
			onChange={onVolumeChanged}
			value={volume}
			onStartHandleDrag={this.props.onStartVolumeDrag}
		/>;

		const nextDialog = <NextDialog item={nextPlaylistItem} goToNextPlaylistItem={goToNextPlaylistItem}/>
		const ccDialog = <CCDialog 
			onClickSettings={onClickCCSettings}
		/>;

		let volIconClass;
		if (volume < 0.3) {
			volIconClass = "small";
		}
		else if (volume < 0.7) {
			volIconClass = "medium";
		}
		else {
			volIconClass = "max";
		}

		return (
			<div className="control-bar">
				<ProgressBar 
					currentTime={currentTime}
					duration={duration}
					onChange={onScrubberChanged}
					isScrubbing={isScrubbing}
					videoSrc={videoSrc}
				/>
				<div className="control-bar__left">
					<div className="play-control" onClick={this.onTogglePlay}>
						<i className="iconcss icon-play"></i>
						<i className="iconcss icon-pause"></i>
					</div>
					<div className="control-bar__time">
						{ formatTime(currentTime) } / { formatTime(duration) }
					</div>
				</div>
				<div className="control-bar__right">
					{
						nextPlaylistItem !== undefined ?
							<HoverDialog dialog={nextDialog}> 
								<div className="control-bar__icon control-bar__icon--next">
									<i className="iconcss icon-next" onClick={goToNextPlaylistItem}></i>
								</div>
							</HoverDialog>
						:
							null
					}

					<HoverDialog dialog={ccDialog}>
						<div className="control-bar__icon">
							<i className="iconcss icon-cc"></i>
						</div>
					</HoverDialog>
					<HoverDialog dialog={volumeDialog} alwaysShowIf={isVolumeDragging}>
						<div className="control-bar__icon">
							<i className={"iconcss icon-volume-" + volIconClass } onClick={this.onToggleVolume}></i>
						</div>
					</HoverDialog>

					<div className="control-bar__icon" onClick={this.props.onToggleFullScreen}>
						<i className="control-bar__icon-fullscreen"></i>
					</div>
				</div>
			</div>
		)
	}
}