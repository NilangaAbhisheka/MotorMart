import useCountdown from '../hooks/useCountdown.jsx'

export default function CountdownTimer({ endTime, endedLabel = 'Auction Ended' }) {
  const { remainingMs, parts, isEnded } = useCountdown(endTime)

  if (isEnded) {
    return <span className="text-danger font-medium">{endedLabel}</span>
  }

  return (
    <span className="inline-flex items-center gap-1 text-secondary font-semibold transition-all duration-300">
      <span>{parts.days}d</span>
      <span>{parts.hours}h</span>
      <span>{parts.minutes}m</span>
      <span className="tabular-nums">{parts.seconds}s</span>
    </span>
  )
}


