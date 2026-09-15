export function QuantityStepper({ quantity, onChange, min = 1 }) {
  return (
    <div className="stepper">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, quantity - 1))}
      >
        −
      </button>
      <span>{quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(quantity + 1)}>
        +
      </button>
    </div>
  )
}
