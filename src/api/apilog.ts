import {request} from "@/utils/service"

interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
}

/** 获取api信息 */
export function getApiLog(data: IGetTableDataApi) {
  return request({
    url: "log/get",
    method: "post",
    data
  })
}
export function deleteApiLog(data: any[]) {
  return request({
    url: "log/delete",
    method: "post",
    data
  })
}

export function getLogCount() {
  return request({
    url: "message/getLogCount",
    method: "get"
  })
}

export function getCommentCount() {
  return request({
    url: "message/getCommentCount",
    method: "get"
  })
}
export function getBlogCount() {
  return request({
    url: "message/getBlogCount",
    method: "get"
  })
}
export function getUserCount() {
  return request({
    url: "message/getUserCount",
    method: "get"
  })
}
