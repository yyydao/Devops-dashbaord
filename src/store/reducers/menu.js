import {
  SET_PERMISSIONLIST
} from '../actions/menu'

const initialState = {
  permissionList: null,
}


export default function project(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PERMISSIONLIST:
      return Object.assign({}, state, { permissionList: action.payload.data})

    default:
      return state
  }
}
