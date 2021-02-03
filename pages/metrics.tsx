import Head from 'next/head'
import type { FC } from 'react'

import { ClusterMetrics } from '../components/ClusterMetrics'

const Metrics: FC = () => {
  return (
    <div>
      <Head>
        <title>Cluster metrics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="w-4/5">
          <ClusterMetrics />
        </div>
      </div>
    </div>
  )
}

export default Metrics
