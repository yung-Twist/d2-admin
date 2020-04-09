// 整理权限集
let newPermission = new Map()
export function settlePermission (arr) {
  for (let item of arr) {
    newPermission.set(item.managerMenuAuthorityTab, item.managerMenuAuthorityTab)
    if (item.child.length != 0) {
      settlePermission(item.child)
    }
  }
  return newPermission
}

// 判断是否有该权限
export function hasPermission (managerRoleAuthority, managerMenuAuthorityTab) {
  for (let item of managerRoleAuthority) {
    if (item == managerMenuAuthorityTab) {
      return true
    }
  }
  return false
}
