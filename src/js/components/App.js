import React, { Component, PropTypes } from 'react';
import classNames from "classnames";
import Video from './Video';
import ControlBar from './ControlBar';
import PauseCard from './PauseCard';
import CCCard from './CCCard';
import SqueezeCard from './SqueezeCard';
import CoverImg from './CoverImg';
import ShareCard from './ShareCard';
import ShareTrigger from './ShareTrigger';

const bpXlarge = 1800;
const bpLarge = 1400;
const bpDesktop = 1100;
const bpMedium = 800;
const bpSmall = 600;
const bpXsmall = 480; // for isMobile

export default class App extends Component {

	static propTypes = {
		aspectRatio: PropTypes.number,
		playlist: PropTypes.array,
		showSqueezeCard: PropTypes.bool,
		playlist: PropTypes.array,
		initialPlaylistIndex: PropTypes.number,
		endCardLinks: PropTypes.array,
		controlBarHoverTimeout: PropTypes.number,
		playNextDelay: PropTypes.number
	}


	constructor(props) {
		super(props);

		// Initial state
		this.state = {
			currPlaylistIndex: props.initialPlaylistIndex,
			containerHover: false,
			isPlaying: false,
			isWaiting: true,
			isScrubbing: false,
			isVolumeDragging: false,
			isVideoEnd: false,
			isFullScreen: false,
			showCCSettings: false,
			currentTime: 0,
			duration: 0,
			volume: 1,
			endCardOpen: false,
			squeezeCardOpen: false,
			showShareCard: false,
			isMobile: false,
			isTouch: false,
			window : {
				width : 0,
				height : 0
			}
		}
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.onWindowResize);
	}

	onWindowResize = (e) => {
		var w = window,
		d = document,
		documentElement = d.documentElement,
		body = d.getElementsByTagName('body')[0],
		width = w.innerWidth || documentElement.clientWidth || body.clientWidth,
		height = w.innerHeight|| documentElement.clientHeight|| body.clientHeight;

		this.setState({
			window : {
				width : width,
				height : height
			}
		});
		this.detectMobile(width);
	}

	detectMobile = (_w) => {
		var _isMobile = false;
		//check if the size is xsmall
		if (_w <= bpXsmall) _isMobile = true;
		this.setState({
			isMobile : _isMobile
		});
	}

	onMouseUp = () => {
		this.setState({
			isScrubbing: false,
			isVolumeDragging: false
		})
	}

	togglePlay = () => {
		this.setState({
			isPlaying: !this.state.isPlaying,
			isVideoEnd: false
		})
	}

	onProgress = (time) => {
		let newState = {
			currentTime: time
		}
		// Open up the sqeeze card as we approach the end
		if (this.props.endCardShowTime > 0) {
			let timeLeft = this.state.duration - time;
			if (!this.state.squeezeCardOpen && timeLeft <= this.props.endCardShowTime && timeLeft > this.props.endCardShowTime - 1) {
				newState.squeezeCardOpen = true;
			}
		}
		this.setState(newState);
	}

	onLoad = (data) => {
		this.setState({
			isWaiting: false,
			duration: data.duration,
			isTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
		})
		this.onWindowResize();
		window.addEventListener("resize", this.onWindowResize);
	}

	onVideoClick = (e) => {
		e.preventDefault();
		if (this.state.squeezeCardOpen) {
			this.setState({
				squeezeCardOpen: false
			})
		}
		else {
			this.togglePlay();
		}
	}

	onVideoEnd = () => {
		this.setState({
			isPlaying: false,
			isVideoEnd: true
		})
	}

	onVolumeChanged = (val, fromMouse = true) => {
		this.setState({
			volume: val,
			isVolumeDragging: fromMouse
		})
	}

	onScrubberChanged = (val, fromMouse = true) => {
		this.setState({
			isScrubbing: fromMouse,
			currentTime: val
		})
	}

	onToggleFullScreen = () => {
		this.setState({
			isFullScreen: !this.state.isFullScreen
		})
	}

	onClickCCSettings = () => {
		this.setState({
			showCCSettings: true
		})
	}

	onCCSettingsSave = () => {
		this.setState({
			showCCSettings: false
		})
	}

	onCCSettingsCancel = () => {
		this.setState({
			showCCSettings: false
		})
	}

	shareCardShow = () => {
		this.setState({
			showShareCard: true
		})
	}
	shareCardHide = () => {
		this.setState({
			showShareCard: false
		})
	}

	onReplay = () => {
		this.setState({
			isPlaying: true,
			currentTime: 0,
			squeezeCardOpen: false
		})
	}

	onMouseMove = (e) => {
		clearTimeout(this.mouseMoveTimeout);
		this.mouseMoveTimeout = setTimeout(this.clearJustMouseMoved, this.props.controlBarHoverTimeout*1000);
		if (!this.state.isJustMouseMoved) {
			this.setState({
				isJustMouseMoved: true
			})
		}
	}

	onMouseLeave = (e) => {
		clearTimeout(this.mouseMoveTimeout);
		if (this.state.isJustMouseMoved) {
			this.setState({
				isJustMouseMoved: false
			})
		}		
	}

	clearJustMouseMoved = () => {
		this.setState({
			isJustMouseMoved: false,
		})
	}


	goToNextPlaylistItem = () => {

		const { playlist } = this.props;
		const { currPlaylistIndex } = this.state;
		
		if (playlist[currPlaylistIndex + 1] == undefined) {
			return;
		}

		this.setState({
			currPlaylistIndex: currPlaylistIndex + 1,
			isWaiting: true,
			isPlaying: true,
			currentTime: 0,
			endCardOpen: false,
			squeezeCardOpen: false,
			showShareCard: false,
			showCCSettings: false,
			isVideoEnd: false
		})

	}

	render() {

		const { 
			aspectRatio, 
			endCardShowTime,
			playlist,
			endCardLinks,
			playNextDelay
		} = this.props;

		const { 
			isPlaying, 
			currentTime, 
			duration, 
			isScrubbing, 
			volume, 
			isVolumeDragging, 
			isFullScreen,
			isVideoEnd,
			isJustMouseMoved,
			showCCSettings,
			isWaiting,
			showShareCard,
			squeezeCardOpen,
			isMobile,
			isTouch,
			currPlaylistIndex

			
		} = this.state;

		const { videoSrc, coverImgSrc, title, subtitle, description } = playlist[currPlaylistIndex];
		const nextPlaylistItem = playlist[currPlaylistIndex + 1];
		const hasNextItem = nextPlaylistItem !== undefined;
		const timeToEnd = duration - currentTime;
		//const nextCountdown = parseInt(duration - currentTime + playNextDelay);

		const showCCSettingsCalc = (this.state.window.width > bpSmall) && showCCSettings;
		const coverImgShow = (currentTime === 0 && !isPlaying);
		const replayCardShow = isVideoEnd && !hasNextItem;

		const pauseCardShow = (isVideoEnd ? false : !isPlaying)  && !showShareCard && !showCCSettingsCalc;
		const endCardMode = "squeeze";
		let endCardShow;

		if (endCardShowTime === 0) {
			endCardShow = (timeToEnd <= 0.2) && !showShareCard && hasNextItem && !isWaiting;
		}
		else {
			endCardShow = (squeezeCardOpen || timeToEnd <= 0.2) && hasNextItem && !isWaiting;
		}

		const controlBarShow = (isJustMouseMoved || isScrubbing || isVolumeDragging) && !(endCardShow || coverImgShow || showCCSettingsCalc || showShareCard);
		const showShareTrigger = pauseCardShow || (isJustMouseMoved && !showShareCard && !showCCSettings) || (isVideoEnd && !hasNextItem && !showShareCard);
		const isPlayingCalc = !showShareCard && (!showCCSettingsCalc || isMobile) && isPlaying;
		const runSqueezeCardTimer = !showShareCard;
		const endCardShowInfo = !showShareCard && !showCCSettingsCalc;

		//const controlBarShow = true;
		const classnames = classNames({
			'container': true,
			'container--playing': isPlayingCalc,
			'container--volume-dragging': isVolumeDragging,
			'container--fullscreen': isFullScreen,
			'container--show-controls': controlBarShow,
			'container--show-share-card': showShareCard,
			'container--is-mobile': isMobile,
			'container--is-touch': isTouch,
			'container--show-squeeze-card': endCardShow && endCardMode === "squeeze"
		})

		const style = {
			paddingTop: ((1/aspectRatio) * 100) + "%"
		}

		return (
			<div className={classnames} style={style} ref={(el)=>{this.player = el}} onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave}>
				<Video 
					key={videoSrc}
					videoSrc={videoSrc} 
					currentTime={currentTime}
					isPlaying={isPlayingCalc}
					isScrubbing={isScrubbing}
					isFullScreen={isFullScreen}
					onLoad={this.onLoad} 
					onProgress={this.onProgress}
					volume={volume}
					onToggleFullScreen={this.onToggleFullScreen}
					onClick={this.onVideoClick}
					onVideoEnd={this.onVideoEnd}
				/>
				<CoverImg
					src={coverImgSrc}
					show={coverImgShow}
				/>
				<PauseCard
					backgroundImgSrc={coverImgSrc}
					show={pauseCardShow}
					onClick={this.togglePlay}
					videoTitle={title}
					videoSubtitle={subtitle}
					videoDescription={description}
					isVideoEnd={isVideoEnd}
					hasNextItem={hasNextItem}
					showShareCard={showShareCard}
				/>
				<PauseCard 
					backgroundImgSrc={coverImgSrc}
					show={replayCardShow}
					onClick={this.togglePlay}
					videoTitle={title}
					videoSubtitle={subtitle}
					videoDescription={description}
					mode="replay"
					isVideoEnd={isVideoEnd}
					hasNextItem={hasNextItem}
					showShareCard={showShareCard}
				/>
				<CCCard
					show={showCCSettingsCalc}
					onSave={this.onCCSettingsSave}
					onCancel={this.onCCSettingsCancel}
				/>
				<ShareCard
					show={showShareCard}
					onClose={this.shareCardHide}
				/>
				<ShareTrigger
					show={showShareTrigger}
					isVideoEnd={isVideoEnd}
					hasNextItem={hasNextItem}
					showShareCard={showShareCard}
					onClick={this.shareCardShow}
				/>
				<SqueezeCard
					show={endCardShow}
					backgroundImgSrc={coverImgSrc}
					onReplay={this.onReplay}
					goToNextPlaylistItem={this.goToNextPlaylistItem}
					nextItem={nextPlaylistItem}
					mode={endCardMode}
					links={endCardLinks}
					playNextDelay={playNextDelay}
					timeToEnd={timeToEnd}
					runTimer={runSqueezeCardTimer}
				/>
				<ControlBar
					isScrubbing={isScrubbing}
					isPlaying={isPlaying}
					onTogglePlay={this.togglePlay}
					currentTime={currentTime}
					duration={duration}
					onStartHandleDrag={this.onStartHandleDrag}
					volume={volume}
					onVolumeChanged={this.onVolumeChanged}
					onStartVolumeDrag={this.onStartVolumeDrag}
					isVolumeDragging={isVolumeDragging}
					onScrubberChanged={this.onScrubberChanged}
					onToggleFullScreen={this.onToggleFullScreen}
					onClickCCSettings={this.onClickCCSettings}
					videoSrc={videoSrc}
					nextPlaylistItem={nextPlaylistItem}
					goToNextPlaylistItem={this.goToNextPlaylistItem}
				/>
			</div>
		)
	}
}