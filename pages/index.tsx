import Head from 'next/head'
import Link from 'next/link'
import type { FC } from 'react'

const Home: FC = () => {
  return (
    <div>
      <Head>
        <title>Homepage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="w-4/5">
          <div>
            <Link href="/metrics">Click here to see metrics</Link>
          </div>
          <div>
            <Link href="/graph">Click here to see graph</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
