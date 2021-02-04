import { FC, useEffect, useState } from 'react'

import type { ClusterDTO } from './Cluster'
import type { ClusterStatus } from './ClusterStatus'
import { MetricsDisplay } from './MetricsDisplay'

const getClusterNodes = async (): Promise<ClusterDTO[]> => {
  const response = await fetch('/api/metrics')
  return await response.json()
}

export const ClusterMetrics: FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clusterStatuses, setClusterStatuses] = useState<
    Record<string, ClusterStatus>
  >({})

  useEffect(() => {
    const fetchClusterNodes = async () => {
      setLoading(true)
      try {
        const nodes = await getClusterNodes()
        const newClusterStatuses = getClusterStatuses(nodes)
        setClusterStatuses(newClusterStatuses)
      } catch (error) {
        setError(error?.message ?? '')
      } finally {
        setLoading(false)
      }
    }

    fetchClusterNodes()
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Failed to load cluster nodes: {JSON.stringify(error)}</p>
  }

  const statuses = Object.entries(clusterStatuses)

  if (!statuses.length) {
    return <p>No cluster data</p>
  }

  const cols = statuses.length % 3 === 0 ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className={`grid gap-5 ${cols}`}>
      {statuses.map(([cluster, status]) => (
        <MetricsDisplay key={cluster} cluster={cluster} status={status} />
      ))}
    </div>
  )
}

const getClusterStatuses = (nodes: ClusterDTO[]) => {
  return nodes.reduce<Record<string, ClusterStatus>>((clusters, node) => {
    if (!clusters[node.clusterId]) {
      return {
        ...clusters,
        [node.clusterId]: {
          [node.stage]: 1,
          total: 1
        }
      }
    }

    const cluster = clusters[node.clusterId]

    return {
      ...clusters,
      [node.clusterId]: {
        ...cluster,
        [node.stage]: (cluster[node.stage] ?? 0) + 1,
        total: cluster.total + 1
      }
    }
  }, {})
}
