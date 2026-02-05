export function Input({ invalid, ...props }) {
  return (
    <input
      {...props}
      aria-invalid={invalid ? 'true' : 'false'}
      className={[
        'w-full rounded-xl border bg-slate-900/60 px-3 py-2 text-slate-100',
        'placeholder:text-slate-500 focus:outline-none focus:ring-2',
        invalid
          ? 'border-red-500/80 focus:ring-red-500/40'
          : 'border-slate-700 focus:ring-indigo-500/60',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

export function Label(props) {
  return (
    <label
      {...props}
      className={['text-sm font-medium text-slate-200', props.className ?? ''].join(' ')}
    />
  )
}

export function Button({ variant = 'primary', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60'
  const styles =
    variant === 'ghost'
      ? 'bg-transparent text-slate-200 hover:bg-slate-800 border border-slate-700'
      : 'bg-indigo-600 text-white hover:bg-indigo-500'

  return (
    <button {...props} className={[base, styles, props.className ?? ''].join(' ')} />
  )
}

export function Card(props) {
  return (
    <div
      {...props}
      className={[
        'rounded-2xl border border-slate-800 bg-slate-950/60 shadow-xl backdrop-blur px-6 py-6',
        props.className ?? '',
      ].join(' ')}
    />
  )
}

