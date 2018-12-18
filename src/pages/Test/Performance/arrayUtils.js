export const intersectionArray = (arr1, arr2) => {
  return arr1.filter(x => arr2.includes(x))
}

export const differenceArray = (arr1, arr2) => {
  return arr1
    .filter(x => !arr2.includes(x))
    .concat(arr2.filter(x => !arr1.includes(x)))
  // return  arr1.filter(x => !arr2.includes(x));
}

export const removeItemsByValue = (originalArray, removeItems) => {
  /*eslint-disable array-callback-return*/
  removeItems.map(item => {
    let removeIndex = originalArray.indexOf(item)
    if (removeIndex > -1) {
      originalArray.splice(removeIndex, 1)
    }

  })
  return originalArray
}
