export default function BodyTypes({ onBodyTypeSelect, selectedBodyType }) {
  const types = [
    'Sedan','SUV','Sports','Convertible','Compact','Pick Up','Crossover','Electric'
  ]
  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6">
          <div className="text-sm uppercase tracking-wide text-muted">Find your style</div>
          <h3 className="text-xl font-semibold">Search by Body Type</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {types.map((t, i) => (
            <button 
              key={i} 
              onClick={() => onBodyTypeSelect(selectedBodyType === t ? '' : t)}
              className={`card p-4 text-center transition-all duration-200 ${
                selectedBodyType === t 
                  ? 'bg-secondary text-secondary-foreground shadow-lg' 
                  : 'hover:shadow-lg hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {selectedBodyType && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => onBodyTypeSelect('')}
              className="text-sm text-muted hover:text-secondary"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </section>
  )
}


