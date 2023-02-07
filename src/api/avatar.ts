interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
}

import {request} from "@/utils/service"

export function getAvatarList(data: IGetTableDataApi) {
  return request({
    url: "avatar/get",
    method: "post",
    data
  })
}
