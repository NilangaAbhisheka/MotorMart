import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null
  return (
    <nav className="text-sm text-neutral-600" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={idx} className="flex items-center gap-2">
              {idx > 0 && <span className="text-neutral-400">/</span>}
              {isLast ? (
                <span className="font-medium text-neutral-800" aria-current="page">{item.label}</span>
              ) : (
                <Link to={item.href} className="hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-300 rounded">
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}


