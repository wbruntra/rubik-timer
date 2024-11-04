import React, { useState, useEffect, useCallback } from 'react'
import useWakeLock from './useWakeLock'

const renderTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toFixed(1).padStart(4, '0')}`
}


function Timer({ isActive, setIsActive, onSave, onStart, timeSaved = false }) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState(null)

  const startTimer = () => {
    // const newStartTime = new Date().getTime()
    onStart()
    setIsActive(true)
    setElapsedTime(0)
    setStartTime(new Date().getTime())
    // setElapsedTime((new Date().getTime() - newStartTime) / 1000)
  }

  const addTime = useCallback(() => {
    const timeNow = new Date().getTime()

    setElapsedTime((timeNow - startTime) / 1000)
  }, [setElapsedTime, startTime])

  useWakeLock(isActive)

  useEffect(() => {
    let interval = null
    if (isActive) {
      console.log('start interval')
      interval = setInterval(() => {
        addTime()
      }, 200)
    }
    return () => clearInterval(interval)
  }, [isActive, addTime])

  const stopTimer = useCallback(() => {
    setIsActive(false)
    // const endTime = new Date().getTime()
    // console.log(endTime, startTime)
    // const timeElapsed = (endTime - startTime) / 1000
    // console.log('timeElapsed', timeElapsed)
    // setElapsedTime(timeElapsed)
  }, [setIsActive])

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
  }, [isActive, stopTimer])

  const resetTimer = () => {
    setElapsedTime(0)
    setIsActive(false)
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
            <button className="btn btn-lg btn-success me-2" onClick={startTimer}>
              Start
            </button>
            <button className="btn btn-lg btn-warning" onClick={resetTimer}>
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
                disabled={timeSaved}
              >
                {timeSaved ? 'Saved!' : 'Save Time'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Timer
