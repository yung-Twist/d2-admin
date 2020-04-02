import request from '@/plugin/axios'

export function GetMenuList (data) {
  return request.post('/v1/admin/common/menuList', data)
}
