import instance from './axios'

export const getImages = async (currentPage, pageSize, tags) => {
  const res = await instance(
    `/images?currentPage=${currentPage}&pageSize=${pageSize}&tags=${
      tags.length ? tags : ''
    }`
  )
  return res.data
}