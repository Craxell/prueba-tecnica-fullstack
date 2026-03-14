import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { styles } from '../../constants/styles'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export const TextInput = forwardRef<HTMLInputElement, Props>(
  function TextInput({ className = '', ...rest }, ref) {
    return (
      <input
        ref={ref}
        className={`${styles.input} ${className}`}
        {...rest}
      />
    )
  },
)
