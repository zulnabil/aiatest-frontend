import React, { FC, useEffect, useState } from 'react'
import axios from 'axios'
import { Layout, Typography, Row, Col, Image, Skeleton, Button, Spin } from 'antd'

import CardImage from './Card'
import classes from './Home.module.css'

const { Title } = Typography

interface ResponseImages {
  data: Image[]
  meta: {
    currentPage: number
    pageSize: number
    totalPage: number
    totalData: number
    modified: string
  }
}

const Home: FC = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(4)
  const [tags, setTags] = useState<string[]>([])
  const [initLoading, setInitLoading] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [images, setImages] = useState<ResponseImages>({} as ResponseImages)
  const [list, setList] = useState<Image[]>([])

  useEffect(() => {
    getData(currentPage, pageSize)
      .then((res) => {
        setImages(res)
        setList(res.data)
        setInitLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setInitLoading(false)
      })
  }, [])

  const getData = async (currentPage, pageSize) => {
    const res = await axios(
      `${process.env.REACT_APP_API_URL}/images?currentPage=${currentPage}&pageSize=${pageSize}&tags=${
        tags.length ? tags : ''
      }`
    )
    return res.data
  }

  const onLoadMore = async () => {
    setLoading(true)
    setList(images.data.concat([...new Array(pageSize)].map(() => ({ loading: true, title: '' } as Image))))
    setCurrentPage(currentPage + 1)
    const res = await getData(currentPage + 1, pageSize)
    const data = images.data.concat(res.data)
    setImages({ ...res, data })
    setList(data)
    setLoading(false)
  }

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}>Load more</Button>
      </div>
    ) : null

  return (
    <Layout className={classes['container']}>
      <div>
        <Title level={3}>List public images from Flickr</Title>
        <section>
          {initLoading && <Spin size="large" />}
          <Row gutter={[16, 24]} justify="center">
            {list.map((item) => (
              <Col xs={20} sm={16} md={12} lg={8} xl={6}>
                <CardImage {...item} />
              </Col>
            ))}
          </Row>
          {loadMore}
        </section>
      </div>
    </Layout>
  )
}

export default Home
