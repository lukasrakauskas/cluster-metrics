import Head from 'next/head'
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
          <p>links here</p>
        </div>
      </div>
    </div>
  )
}

export default Home
