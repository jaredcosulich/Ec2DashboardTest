import {
  TWButton,
  TWInlineCircleSpinner
} from '.'

import { useState } from 'react';

const TWButtonWithSpinner = (props) => {
  const [processing, setProcessing] = useState(false)

  const { onClick, children, ...buttonProps } = props

  const reset = () => setProcessing(false)

  return (
    <TWButton
      onClick={(event) => {
        if (onClick) {
          setProcessing(true)
          onClick(event, reset)
        }
      }}
      {...buttonProps}
    >
      {processing ? 
        <TWInlineCircleSpinner /> :
        children
      }
    </TWButton>
  )
}

export default TWButtonWithSpinner;