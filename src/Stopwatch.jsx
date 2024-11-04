import React, { useState, useEffect } from 'react'

function Stopwatch() {
  const [time, setTime] = useState(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    let interval = null
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1)
      }, 100)
    } else if (!isActive && time !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, time])

  const startTimer = () => {
    setIsActive(true)
  }

  const stopTimer = () => {
    setIsActive(false)
  }

  const resetTimer = () => {
    setTime(0)
    setIsActive(false)
  }

  return (
    <div>
      <p>{time.toFixed(1)}</p>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  )
}

export default Stopwatch
