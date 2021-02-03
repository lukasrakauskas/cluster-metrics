import ParentSize from '@visx/responsive/lib/components/ParentSize'
import Head from 'next/head'
import type { FC } from 'react'

import { Graph } from '../components/Graph'

const Metrics: FC = () => {
  return (
    <div>
      <Head>
        <title>Cluster metrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="block w-4/5 md:w-3/5 h-2/3">
          <ParentSize>
            {({ width, height }) => <Graph width={width} height={height} />}
          </ParentSize>
        </div>
      </div>
    </div>
  )
}

export default Metrics
