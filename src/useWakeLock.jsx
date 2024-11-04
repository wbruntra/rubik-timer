import { useEffect } from 'react'

let wakeLock = null

// Custom hook
const useWakeLock = (isActive) => {
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        wakeLock = await navigator.wakeLock.request('screen')
        wakeLock.addEventListener('release', () => {
          console.log('Wake Lock was released')
        })
        console.log('Wake Lock is active')
      } catch (err) {
        console.error(`${err.name}, ${err.message}`)
      }
    }

    const releaseWakeLock = () => {
      if (wakeLock !== null) {
        wakeLock.release().then(() => {
          wakeLock = null
          console.log('Wake Lock was released')
        })
      }
    }

    if (isActive) {
      requestWakeLock()
    } else {
      releaseWakeLock()
    }

    return () => {
      releaseWakeLock()
    }
  }, [isActive])
}

export default useWakeLock
