import React, { useState, useEffect } from 'react'

const renderTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toFixed(1).padStart(4, '0')}`
}

function Timer({ isActive: initialIsActive = false, onElapsed, onSave, onStart }) {
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isActive, setIsActive] = useState(initialIsActive)

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        const elapsedSeconds = (new Date().getTime() - startTime) / 1000
        setElapsedTime(elapsedSeconds)
      }, 200)
    } else if (!isActive && elapsedTime !== 0) {
      clearInterval(interval)
      onElapsed && onElapsed(elapsedTime)
    }
    return () => clearInterval(interval)
  }, [isActive, startTime])

  const startTimer = () => {
    onStart()
    setIsActive(true)
    setStartTime(new Date().getTime())
  }

  const stopTimer = () => {
    setIsActive(false)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ' ' && isActive) {
        stopTimer()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isActive])

  const resetTimer = () => {
    setElapsedTime(0)
    setIsActive(false)
    setStartTime(null)
  }

  return (
    <div className="text-center my-4">
      <p className="display-4">{renderTime(elapsedTime)}</p>
      {isActive ? (
        <button className="btn btn-lg btn-danger" onClick={stopTimer}>
          Stop
        </button>
      ) : (
        <>
          <div>
            <button className="btn btn-success me-2" onClick={startTimer}>
              Start
            </button>
            <button className="btn btn-warning" onClick={resetTimer}>
              Reset
            </button>
          </div>
          {elapsedTime > 0 && (
            <div className="text-center my-4">
              <button
                className="btn btn-info"
                onClick={() => {
                  onSave(elapsedTime)
                }}
              >
                Save Time
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Timer
