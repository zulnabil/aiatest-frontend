import React, { FC, useEffect, useState } from "react"
import axios from "axios"
import { Layout, Typography, Row, Col, Input, Button, Spin } from "antd"

import { getImages } from "services/api"
import useDebounce from "hooks/useDebounce"
import CardImage from "./Card"
import classes from "./Home.module.css"

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
  const [tags, setTags] = useState<string>("")
  const [initLoading, setInitLoading] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [images, setImages] = useState<ResponseImages>({} as ResponseImages)
  const [list, setList] = useState<Image[]>([])

  const debouncedTags = useDebounce(tags, 500)

  useEffect(() => {
    getImages(currentPage, pageSize, tags)
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

  useEffect(() => {
    if (debouncedTags) {
      setCurrentPage(1)
      setInitLoading(true)
      setList([])
      getImages(currentPage, pageSize, debouncedTags).then((res) => {
        setInitLoading(false)
        setImages(res)
        setList(res.data)
      })
    } else {
      setInitLoading(true)
      getImages(currentPage, pageSize, tags).then((res) => {
        setInitLoading(false)
        setImages(res)
        setList(res.data)
      })
    }
  }, [debouncedTags])

  const onLoadMore = async () => {
    setLoading(true)
    handleScrollToBottom()
    setList(
      images.data.concat(
        [...new Array(pageSize)].map(
          () => ({ loading: true, title: "" } as Image)
        )
      )
    )
    setCurrentPage(currentPage + 1)
    const res = await getImages(currentPage + 1, pageSize, tags)
    const data = images.data.concat(res.data)
    setImages({ ...res, data })
    setList(data)
    setLoading(false)
  }
  const endImageRef = React.useRef<HTMLDivElement>()

  const loadMore =
    !initLoading && !loading && currentPage !== images.meta.totalPage ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>Load more</Button>
      </div>
    ) : null

  const handleScrollToBottom = () => {
    setTimeout(
      () =>
        endImageRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      500
    )
  }

  return (
    <Layout className={classes["container"]}>
      <div>
        <Title level={3}>List public images from Flickr</Title>
        <Input
          placeholder="Search tags"
          onChange={(e) => setTags(e.target.value)}
          style={{ marginTop: "2rem" }}
        />
        <section style={{ marginTop: "2rem" }}>
          {initLoading && <Spin size="large" />}
          <Row gutter={[16, 24]} justify="center">
            {list.map((item, index) => {
              return (
                <Col
                  ref={
                    index === list.length - 1
                      ? (endImageRef as React.RefObject<HTMLDivElement>)
                      : null
                  }
                  key={index}
                  xs={20}
                  sm={16}
                  md={12}
                  lg={8}
                  xl={6}
                >
                  <CardImage {...item} />
                </Col>
              )
            })}
          </Row>
          {loadMore}
        </section>
      </div>
    </Layout>
  )
}

export default Home
