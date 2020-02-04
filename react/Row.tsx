import React from 'react'
import {
  FlexLayoutTypes,
  FlexLayoutContextProvider,
  useFlexLayoutContext,
} from './components/FlexLayoutContext'
import { defineMessages } from 'react-intl'

import { useResponsiveWidth } from './hooks/responsiveWidth'
import {
  parseTachyonsGroup,
  TachyonsScaleInput,
  parseMargins,
  parsePaddings,
  parseBorders,
} from './modules/valuesParser'

import styles from './Row.css'

enum HorizontalAlign {
  left = 'left',
  right = 'right',
  center = 'center',
}

enum VerticalAlign {
  top = 'top',
  middle = 'middle',
  bottom = 'bottom',
}

const HORIZONTAL_ALIGN_MAP = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

const VERTICAL_ALIGN_MAP = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
}

enum ColSizing {
  equal = 'equal',
  auto = 'auto',
}

enum ColJustify {
  between = 'between',
  around = 'around',
}

const JustifyValues = {
  [ColJustify.between]: 'justify-between',
  [ColJustify.around]: 'justify-around',
}

export interface Props extends Flex, Gap, Border {
  blockClass?: string
  marginTop: TachyonsScaleInput
  marginBottom: TachyonsScaleInput
  paddingTop: TachyonsScaleInput
  paddingBottom: TachyonsScaleInput
  preserveLayoutOnMobile?: boolean
  preventHorizontalStretch?: boolean
  preventVerticalStretch?: boolean
  horizontalAlign?: HorizontalAlign
  verticalAlign?: VerticalAlign
  colSizing?: ColSizing
  colJustify?: ColJustify
}

const Row: StorefrontFunctionComponent<Props> = ({
  children,
  colGap,
  rowGap,
  marginTop,
  marginBottom,
  paddingTop,
  paddingBottom,
  border,
  borderWidth,
  borderColor,
  preserveLayoutOnMobile,
  preventHorizontalStretch,
  preventVerticalStretch,
  horizontalAlign,
  verticalAlign,
  colSizing,
  colJustify = ColJustify.between,
}) => {
  const context = useFlexLayoutContext()

  const gaps = parseTachyonsGroup({
    colGap: colGap != null ? colGap : context.colGap,
    rowGap: rowGap != null ? rowGap : context.rowGap,
  })

  const margins = parseMargins({
    marginTop,
    marginBottom,
  })

  const paddings = parsePaddings({
    paddingTop,
    paddingBottom,
  })

  const borders = parseBorders({
    border,
    borderWidth,
    borderColor,
  })

  const { cols, breakOnMobile } = useResponsiveWidth(children, {
    preserveLayoutOnMobile,
  })

  if (context.parent === FlexLayoutTypes.ROW) {
    console.warn(
      'A flex-row is being inserted directly into another flex-row. This might have unpredicted behaviour.'
    )
  }

  const isSizingAuto = colSizing === ColSizing.auto

  const justifyToken =
    JustifyValues[colJustify] || JustifyValues[ColJustify.between]

  const horizontalAlignClass =
    HORIZONTAL_ALIGN_MAP[horizontalAlign || HorizontalAlign.left] ||
    HORIZONTAL_ALIGN_MAP.left

  const verticalAlignClass =
    VERTICAL_ALIGN_MAP[VerticalAlign || VerticalAlign.top] ||
    VERTICAL_ALIGN_MAP.top

  return (
    <FlexLayoutContextProvider parent={FlexLayoutTypes.ROW} {...gaps}>
      <div
        className={`${
          breakOnMobile ? 'flex-none flex-ns' : 'flex'
        } ${margins} ${paddings} ${borders} ${horizontalAlignClass} ${
          isSizingAuto ? justifyToken : ''
        } items-stretch w-100`}
      >
        {cols.map((col, i) => {
          const isLast = i === cols.length - 1
          const colGap = isLast ? 0 : gaps.colGap
          const rowGap = isLast ? 0 : gaps.rowGap

          return (
            <div
              key={i}
              className={`${
                /** If it breaks line on mobile, use the rowGap as bottom padding */
                breakOnMobile
                  ? `pr${colGap}-ns pb${rowGap} pb0-ns`
                  : `pr${colGap}`
              } ${preventVerticalStretch ? '' : 'items-stretch'} ${
                preventHorizontalStretch ? '' : styles.stretchChildrenWidth
              } ${col.width === 'grow' ? 'flex-grow-1' : ''} flex`}
              style={{
                width:
                  preventHorizontalStretch ||
                  (isSizingAuto && !col.hasDefinedWidth)
                    ? 'auto'
                    : breakOnMobile
                    ? '100%'
                    : col.width,
              }}
            >
              {col.element}
            </div>
          )
        })}
      </div>
    </FlexLayoutContextProvider>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.row.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.row.description',
  },
})

Row.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default Row
