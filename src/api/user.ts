import { request } from "@/utils/service"

interface ICreateTableDataApi {
  account: string
  password: string
  avatar?: string | number
}

interface IUpdateTableDataApi {
  userId: number
  account: string
  password?: string
  avatar?: string | number
}

interface IGetTableDataApi {
  /** 当前页码 */
  pageIndex: number
  /** 查询条数 */
  pageSize: number
  /** 查询参数 */
  account?: string
  userid?: string
}

/** 增 */
export function createTableDataApi(data: ICreateTableDataApi) {
  return request({
    url: "user/add",
    method: "post",
    data
  })
}

/** 删 */
export function deleteTableDataApi(id: number) {
  return request({
    url: `user/delete`,
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
export function updateTableDataApi(data: IUpdateTableDataApi) {
  return request({
    url: "user/update",
    method: "post",
    data
  })
}

/** 查 */
export function getTableDataApi(params: IGetTableDataApi) {
  return request({
    url: "user/get",
    method: "post",
    data: params
  })
}

export function saveMyAbout(data: string) {
  return request({
    url: "user/setAboutMe",
    method: "post",
    data: { aboutMe: data }
  })
}

export function getMyAbout() {
  return request({
    url: "user/getAboutMe",
    method: "get"
  })
}
