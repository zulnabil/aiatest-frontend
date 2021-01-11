import React, { FC } from 'react'
import { Typography } from 'antd'

const { Title } = Typography

const Home: FC = (): JSX.Element => {
  return (
    <>
      <Title level={3}>List public images from Flickr</Title>
    </>
  )
}

export default Home
