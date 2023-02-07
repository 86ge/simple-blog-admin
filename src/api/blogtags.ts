import {request} from "@/utils/service"

interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
}

/** 获取api信息 */
export function getBlogTags(data: IGetTableDataApi) {
  return request({
    url: "blog/tags/get",
    method: "post",
    data
  })
}

export function setBlogTags(data: { blogId: number | string; tags: string[] | number[] }) {
  return request({
    url: "blog/setTags",
    method: "post",
    data
  })
}
