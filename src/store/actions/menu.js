import { reqGet, reqPost } from '@/api/api'

export const SET_PERMISSIONLIST = 'SET_PERMISSIONLIST';

export function setPermissionList(permissionList){
  return { type: 'SET_PERMISSIONLIST', data: permissionList };
}
