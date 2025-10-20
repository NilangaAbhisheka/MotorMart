import useCountdown from '../hooks/useCountdown.jsx'

export default function CountdownTimer({ endTime, endedLabel = 'Auction Ended' }) {
  const { remainingMs, parts, isEnded } = useCountdown(endTime)

  if (isEnded) {
    return <span className="text-danger font-semibold">{endedLabel}</span>
  }

  const lessThanFiveMinutes = remainingMs <= 5 * 60 * 1000

  return (
    <div
      className={`inline-flex items-end gap-3 font-semibold tabular-nums ${lessThanFiveMinutes ? 'text-secondary animate-pulse-slow' : 'text-neutral-800'}`}
      aria-live="polite"
    >
      <TimeBlock value={parts.days} label="days" />
      <TimeBlock value={parts.hours} label="hrs" />
      <TimeBlock value={parts.minutes} label="min" />
      <TimeBlock value={parts.seconds} label="sec" />
    </div>
  )
}

function TimeBlock({ value, label }) {
  return (
    <div className="text-center">
      <div className="text-xl leading-none">{value}</div>
      <div className="text-xs text-neutral-500 leading-none">{label}</div>
    </div>
  )
}


