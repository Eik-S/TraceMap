/// <reference types="react-app-rewired" />

import { SerializedStyles } from '@emotion/react'

declare module 'react' {
  interface Attributes {
    css?: SerializedStyles
  }
}
