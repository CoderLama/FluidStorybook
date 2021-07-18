// Libs & utils
import React, { Component } from 'react';
import { secondsToPixels, toHHMMSS, getAmountOfSecondsAtXPos } from '../utils/Utils';
import classNames from 'classnames';
import { PlayerState } from '../definitions';

// CSS
import './PlayerControl.css'

export interface IPlayerControlProps {
  playerState: PlayerState,
  onPlayerStateUpdateProposal: Function,
  playerIsMuted: boolean,
  playerIsMaximized: boolean,
  mediaProgress: number,
  mediaDuration?: number,
  onMuteBtnPressed: any,
  onMaximizeBtnPressed: any;
}

export class PlayerControls extends Component<IPlayerControlProps, {}> {
  private progressBar;

	render () {
		const {
			playerState,
			onPlayerStateUpdateProposal,
			playerIsMuted,
			playerIsMaximized,
			mediaProgress,
			mediaDuration,
			onMuteBtnPressed,
			onMaximizeBtnPressed
		} = this.props

		if ( !mediaDuration ) {
			return false
		}
		const mediaIsPlaying = playerState === PlayerState.PLAYING
		const mediaIsMuted = playerIsMuted
		const mediaIsMaximized = playerIsMaximized
		const progressBarWidth = this.progressBar ? this.progressBar.offsetWidth : null
		const progressInSeconds = mediaProgress
		const progressInPixels = secondsToPixels ( progressInSeconds, progressBarWidth, mediaDuration )
		const formattedProgressString = toHHMMSS ( progressInSeconds )
// console.log('formatted time ' + formattedProgressString + ', ' + progressInPixels + ', ' + mediaDuration)
		const playBtnClassNames = classNames ( 'player-btn btn-left fa', {
			'fa-pause': mediaIsPlaying,
			'fa-play': !mediaIsPlaying
		} )
		const muteBtnClassNames = classNames ( 'player-btn btn-left fa', {
			'fa-volume-off': mediaIsMuted,
			'fa-volume-up': !mediaIsMuted
		} )
		const maximizeBtnClassNames = classNames ( 'player-btn btn-right fa', {
			'fa-minus-square-o': mediaIsMaximized,
			'fa-arrows-alt': !mediaIsMaximized
		} )

		return (
			<div className="player-controls-overlay"
				 onClick={ () => {
					  onPlayerStateUpdateProposal ( {
						  playerState: mediaIsPlaying ? PlayerState.PAUSED : PlayerState.PLAYING,
						  timeInMedia: progressInSeconds
					  })
					}
				 }>

				<div className="control-bar bottom" onClick={( event ) => event.stopPropagation ()}>

					<div className="progress-bar" ref={ e => {this.progressBar = e} }
						 onClick={ ( event ) => {
							 onPlayerStateUpdateProposal ( {
								 playerState: mediaIsPlaying ? PlayerState.PLAYING : PlayerState.PAUSED,
								 timeInMedia: getAmountOfSecondsAtXPos ( event, mediaDuration ),
								 isManualSeek: true
							 })
						 } }>
						<div className="background-bar"></div>
						<div className="progress-indicator" style={{ left: progressInPixels }}></div>
					</div>

					<div className="control-buttons">
						<span className={ playBtnClassNames }
							  onClick={ () => { 
								  onPlayerStateUpdateProposal ( {
									  playerState: mediaIsPlaying ? PlayerState.PAUSED : PlayerState.PLAYING,
									  timeInMedia: progressInSeconds
								  } )}
							  }/>
						<span className={muteBtnClassNames} onClick={ onMuteBtnPressed }/>
						<span className="current-time">{formattedProgressString}</span>

						<span className={maximizeBtnClassNames} onClick={ onMaximizeBtnPressed }/>
					</div>
				</div>
			</div>
		)
	}
}