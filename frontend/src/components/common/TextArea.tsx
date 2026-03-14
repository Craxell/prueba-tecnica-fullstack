import { forwardRef } from 'react'
import type { TextareaHTMLAttributes } from 'react'
import { styles } from '../../constants/styles'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea({ className = '', ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={`${styles.input} min-h-[100px] resize-y ${className}`}
        {...rest}
      />
    )
  },
)
