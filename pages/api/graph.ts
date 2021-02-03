import type { NextApiRequest, NextApiResponse } from 'next'

export default (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).json({
    date: new Date(Date.now()).toISOString(),
    close: Math.random() * (500 - 100) + 100
  })
}
