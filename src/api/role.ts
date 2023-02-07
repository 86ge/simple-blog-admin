import {request} from "@/utils/service"

interface ICreateTableDataApi {
  roleId: number | string
  roleName: string
}

interface IUpdateTableDataApi {
  roleId: number | string
  roleName?: string
}

interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
  roleId?: number | string
  roleName?: string
}

/** 增 */
export function addRoleAPI(data: ICreateTableDataApi) {
  return request({
    url: "role/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteRoleApi(id: number) {
  return request({
    url: `role/delete`,
    method: "post",
    data: { roleid: id },
    transformRequest: [
      function (oldData) {
        // console.log(oldData)
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

/** 改 */
export function updateRoleApi(data: IUpdateTableDataApi) {
  return request({
    url: "role/update",
    method: "post",
    data
  })
}

/** 查 */
export function getRoleApi(params: IGetTableDataApi) {
  return request({
    url: "role/get",
    method: "post",
    data: params
  })
}
