export function Button({
  children,
  variant = 'primary',
  block = false,
  as: Component = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-ghost',
    block ? 'btn-block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  )
}
