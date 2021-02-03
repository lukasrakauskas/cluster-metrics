import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json([
    {
      id: 100,
      ipAddress: '172.16.0.188',
      clusterId: 'A1',
      stage: 'WAITING'
    },
    {
      id: 101,
      ipAddress: '172.16.0.189',
      clusterId: 'A1',
      stage: 'RUNNING'
    },
    {
      id: 102,
      ipAddress: '172.16.0.186',
      clusterId: 'A1',
      stage: 'WAITING'
    },
    {
      id: 103,
      ipAddress: '172.16.0.184',
      clusterId: 'A1',
      stage: 'LOADING'
    },
    {
      id: 104,
      ipAddress: '172.16.0.183',
      clusterId: 'A1',
      stage: 'WAITING'
    },
    {
      id: 105,
      ipAddress: '172.16.0.182',
      clusterId: 'B1',
      stage: 'STOPPED'
    },
    {
      id: 106,
      ipAddress: '172.16.0.181',
      clusterId: 'B1',
      stage: 'RUNNING'
    },
    {
      id: 107,
      ipAddress: '172.16.0.180',
      clusterId: 'B1',
      stage: 'LOADING'
    }
  ])
}
