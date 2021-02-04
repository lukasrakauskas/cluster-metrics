import ParentSize from '@visx/responsive/lib/components/ParentSize'
import { FC, useEffect, useState } from 'react'

import { Graph } from './Graph'
import { StockDTO } from './Stock'

const MAX_STOCKS_COUNT = 20

export const GraphContainer: FC = () => {
  const [error, setError] = useState('')
  const [stocks, setStocks] = useState<StockDTO[]>([])

  useEffect(() => {
    const stockInterval = setInterval(async () => {
      try {
        const response = await fetch('/api/graph')
        const data = await response.json()

        setStocks((prevStocks) => {
          if (prevStocks.length < MAX_STOCKS_COUNT) return [...prevStocks, data]

          const lastTwentyStocks = prevStocks.slice(
            prevStocks.length - MAX_STOCKS_COUNT
          )

          return [...lastTwentyStocks, data]
        })
      } catch (error) {
        setError(error)
      }
    }, 1000)

    return () => {
      clearInterval(stockInterval)
    }
  }, [])

  if (error) {
    return <p>Failed to load cluster nodes: {JSON.stringify(error)}</p>
  }

  if (!stocks.length) {
    return <p>Loading...</p>
  }

  return (
    <ParentSize>
      {({ width, height }) => (
        <Graph stocks={stocks} width={width} height={height} />
      )}
    </ParentSize>
  )
}
