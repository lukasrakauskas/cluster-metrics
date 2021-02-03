import { FC } from 'react'

import type { ClusterStatus } from './ClusterStatus'

interface MetricsDisplayProps {
  status: ClusterStatus
  cluster: string
}

export const MetricsDisplay: FC<MetricsDisplayProps> = ({
  cluster,
  status
}) => {
  const { total, ...otherStatuses } = status
  const statuses = Object.entries(otherStatuses)

  return (
    <div>
      <p>Cluster: {cluster}</p>
      <div className="flex w-full px-3 py-4 bg-white border-b-8 border-black rounded shadow">
        <div className="grid w-3/4 grid-cols-2 grid-rows-2 gap-4">
          {statuses.map(([type, count]) => (
            <div key={type}>
              <span className="block text-xl">{count}</span>
              <span className="text-sm text-gray-500">{pascalCase(type)}</span>
            </div>
          ))}
        </div>
        <div className="w-1/4 mx-4">
          <span className="block text-8xl">{total}</span>
          <span className="text-sm text-gray-500">Total</span>
        </div>
      </div>
    </div>
  )
}

const pascalCase = (word: string) =>
  `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`
