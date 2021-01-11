import React, { FC } from 'react'
import { Layout, Typography } from 'antd'

import classes from './Home.module.css'

const { Title } = Typography

const Home: FC = (): JSX.Element => {
  return (
    <Layout className={classes['container']}>
      <div className={classes['body']}>
        <Title level={3}>List public images from Flickr</Title>
      </div>
    </Layout>
  )
}

export default Home
