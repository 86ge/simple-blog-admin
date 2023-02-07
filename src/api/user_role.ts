import {request} from "@/utils/service"

interface ICreateTableDataApi {
  userId: string
  roleId: string
}

interface IUpdateTableDataApi {
  userId: number
  roleId: string
  password?: string
}

interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
  account?: string
  userId?: string
  roleId?: string
  roleName?: string
}

/** 增 */
export function addUserRoleAPI(data: ICreateTableDataApi) {
  return request({
    url: "role/addUserRole",
    method: "post",
    data
  })
}

/** 删 */
export function deleteUserRoleAPI(id: number) {
  return request({
    url: `role/deleteUserRole`,
    method: "post",
    data: { userid: id },
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
export function updateUserRoleAPI(data: IUpdateTableDataApi) {
  return request({
    url: "role/updateUserRole",
    method: "post",
    data
  })
}

/** 查 */
export function getUserRoleAPI(params: IGetTableDataApi) {
  return request({
    url: "role/getUserRole",
    method: "post",
    data: params
  })
}
