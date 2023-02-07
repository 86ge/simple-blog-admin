import {request} from "@/utils/service"

interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
}

interface IUpdateTableDataApi {
  id: number | string
  context: string
  commentBlogId?: string
  commentUserId?: string
  commentCommentId?: string
}

/** 获取api信息 */
export function getCommentListApi(data: IGetTableDataApi) {
  return request({
    url: "comment/get",
    method: "post",
    data
  })
}
export function getCommentMessageListApi(data: IGetTableDataApi) {
  return request({
    url: "comment/getCommentMessageList",
    method: "post",
    data
  })
}
/** 获取api信息 */
export function updateCommentApi(data: IUpdateTableDataApi) {
  return request({
    url: "comment/update",
    method: "post",
    data
  })
}

export function addCommentApi(data: IUpdateTableDataApi) {
  return request({
    url: "comment/add",
    method: "post",
    data
  })
}
/** 删 */
export function deleteCommentApi(id: number) {
  return request({
    url: `comment/delete`,
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
