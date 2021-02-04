import { curveMonotoneX } from '@visx/curve'
import { localPoint } from '@visx/event'
import { LinearGradient } from '@visx/gradient'
import { GridColumns, GridRows } from '@visx/grid'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Bar, Line } from '@visx/shape'
import {
  defaultStyles,
  Tooltip,
  TooltipWithBounds,
  withTooltip
} from '@visx/tooltip'
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip'
import { bisector, extent, max } from 'd3-array'
import { timeFormat } from 'd3-time-format'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { StockDTO } from './Stock'

type TooltipData = StockDTO

export type AreaProps = {
  width: number
  height: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

type GraphProps = {
  stocks: StockDTO[]
}

type GraphEvent =
  | React.TouchEvent<SVGRectElement>
  | React.MouseEvent<SVGRectElement>

export const background = '#3b6978'
export const background2 = '#204051'
export const accentColor = '#edffea'
export const accentColorDark = '#75daad'
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white'
}

// util
const formatDate = timeFormat('%H:%M:%S')

// accessors
const getDate = (d: StockDTO) => new Date(d.date)
const getStockValue = (d: StockDTO) => d.close
const bisectDate = bisector<StockDTO, Date>((d) => new Date(d.date)).left

export const Graph = withTooltip<AreaProps & GraphProps, TooltipData>(
  ({
    width,
    height,
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
    stocks
  }: AreaProps & GraphProps & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null

    // bounds
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const [event, setEvent] = useState<GraphEvent | null>(null)

    // scales
    const dateScale = useMemo(() => {
      return scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(stocks, getDate) as [Date, Date]
      })
    }, [innerWidth, margin.left, stocks])

    const stockValueScale = useMemo(() => {
      return scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(stocks, getStockValue) || 0) + innerHeight / 3]
      })
    }, [margin.top, innerHeight, stocks])

    // tooltip handler
    const handleTooltip = (event: GraphEvent) => {
      showTooltipData(event)
      setEvent(event)
    }

    useEffect(() => {
      if (event) {
        showTooltipData(event)
      }
    }, [event, stocks])

    const showTooltipData = useCallback(
      (event: GraphEvent) => {
        const { x } = localPoint(event) || { x: 0 }
        const x0 = dateScale.invert(x)
        const index = bisectDate(stocks, x0, 1)
        const d0 = stocks[index - 1]
        const d1 = stocks[index]
        let d = d0
        if (d1 && getDate(d1)) {
          d =
            x0.valueOf() - getDate(d0).valueOf() >
            getDate(d1).valueOf() - x0.valueOf()
              ? d1
              : d0
        }

        if (!d) return

        const value = getStockValue(d)

        if (!value) return

        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d))
        })
      },
      [showTooltip, stockValueScale, dateScale]
    )

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient
            id="area-background-gradient"
            from={background}
            to={background2}
          />
          <LinearGradient
            id="area-gradient"
            from={accentColor}
            to={accentColor}
            toOpacity={0.1}
          />
          <GridRows
            left={margin.left}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<StockDTO>
            data={stocks}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getStockValue(d)) ?? 0}
            yScale={stockValueScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData).toFixed(2)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)'
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    )
  }
)
