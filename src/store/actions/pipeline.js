export const SET_STEP = 'SET_STEP'
export const SET_STEPS = 'SET_STEPS'
export const REMOVE_STEPS = 'REMOVE_STEPS'

export function setStep (step) {
  return { type: 'SET_STEP', data: step }
}

export function setSteps (stepList) {
  return { type: 'SET_STEPS', data: stepList }
}

export function removeSteps (stepList) {
  return { type: 'REMOVE_STEPS', data: stepList }
}
