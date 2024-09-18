import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { IconButton } from '@mui/material'
import React, { useRef, useState } from 'react'

const AudioPlayerWithIcon: React.FC<{ instructionAudioSrc: string }> = ({
    instructionAudioSrc,
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                audioRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    return (
        <>
            <IconButton onClick={handlePlayPause}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>

            {/* Hidden audio element */}
            <audio ref={audioRef} src={instructionAudioSrc} onEnded={() => setIsPlaying(false)} />
        </>
    )
}

export default AudioPlayerWithIcon
