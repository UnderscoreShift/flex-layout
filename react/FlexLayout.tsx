import React, { useContext } from 'react'
import Container from 'vtex.store-components/Container'

import {
  FlexLayoutContext,
  FlexLayoutTypes,
} from './components/FlexLayoutContext'
import Row from './Row'
import { generateBlockClass, BlockClass } from '@vtex/css-handles'

import styles from './components/FlexLayout.css'

interface Props {
  fullWidth?: boolean
  colGap?: number | string
}

const FlexLayout: StorefrontFunctionComponent<Props & BlockClass> = ({
  fullWidth,
  children,
  blockClass,
  colGap,
}) => {
  const context = useContext(FlexLayoutContext)

  const content = <Row colGap={colGap}>{children}</Row>

  const baseClassNames = generateBlockClass(styles.flexRow, blockClass)
  const isTopLevel = context.parent === FlexLayoutTypes.NONE

  if (fullWidth && !isTopLevel) {
    console.warn(
      'Prop `fullWidth` is allowed only on top-level `flex-layout.row` blocks.'
    )
  }

  if (fullWidth || !isTopLevel) {
    return <div className={baseClassNames}>{content}</div>
  }

  return (
    <div className={baseClassNames}>
      <Container>{content}</Container>
    </div>
  )
}

FlexLayout.schema = {
  title: 'editor.row.title',
  description: 'editor.row.description',
}

export default FlexLayout