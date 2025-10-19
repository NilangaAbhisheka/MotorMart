import { useEffect, useMemo, useState } from 'react'

function clampToZero(value) {
  return value < 0 ? 0 : value
}

export default function useCountdown(targetTime) {
  const target = useMemo(() => new Date(targetTime).getTime(), [targetTime])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const intervalId = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(intervalId)
  }, [])

  const remainingMs = clampToZero(target - now)
  const totalSeconds = Math.floor(remainingMs / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    remainingMs,
    isEnded: remainingMs <= 0,
    parts: { days, hours, minutes, seconds },
  }
}


