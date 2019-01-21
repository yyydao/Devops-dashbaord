
export const SET_PROJECTID = 'SET_PROJECTID';
export const SET_PROJECTID_SUCCESS = 'SET_PROJECTID_SUCCESS';

export function setProjectId (projectId) {
  return {
    type: 'SET_PROJECTID',
    data: projectId
  }
}
