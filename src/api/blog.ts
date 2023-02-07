import {request} from "@/utils/service"

interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
}

interface IUpdateTableDataApi {
  id?: number | string
  title?: string
  html?: string
  markdown?: string
  img?: string
  tagsId?: []
  introduction?: string
}

/** 获取api信息 */
export function getBlogListApi(data: IGetTableDataApi) {
  return request({
    url: "blog/get",
    method: "post",
    data
  })
}
/** 获取api信息 */
export function updateBlogApi(data: IUpdateTableDataApi) {
  return request({
    url: "blog/update",
    method: "post",
    data
  })
}

export function addBlogApi(data: IUpdateTableDataApi) {
  return request({
    url: "blog/add",
    method: "post",
    data
  })
}
/** 删 */
export function deleteBlogApi(id: number) {
  return request({
    url: `blog/delete`,
    method: "post",
    data: { blogId: id },
    transformRequest: [
      function (oldData) {
        let newStr = ""
        for (const item in oldData) {
          newStr += encodeURIComponent(item) + "=" + encodeURIComponent(oldData[item]) + "&"
        }
        newStr = newStr.slice(0, -1)
        return newStr
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  })
}
