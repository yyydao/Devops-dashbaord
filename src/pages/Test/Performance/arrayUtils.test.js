import {
    intersectionArray,
    differenceArray,
} from './arrayUtils'

it('should get 2 array intersection ', () => {
    const arr1 = [1,2,3]
    const arr2 = [2,3]

    expect(intersectionArray(arr1,arr2)).toEqual([2,3])
})


it(' diff with empty part1 ', () => {
    const arr1 = [1,2,3]
    const arr2 = []

    expect(differenceArray(arr1,arr2)).toEqual([1,2,3])
})


it(' diff with empty part2 ', () => {
    const arr1 = []
    const arr2 = [1,2,3]

    expect(differenceArray(arr1,arr2)).toEqual([1,2,3])
})


it('should get diff part1 ', () => {
    const arr1 = [1,2,3]
    const arr2 = [1]

    expect(differenceArray(arr1,arr2)).toEqual([2,3])
})

it('should get diff part2', () => {
    const arr1 = [1]
    const arr2 = [1,2,3]

    expect(differenceArray(arr1,arr2)).toEqual([2,3])
})

it('should get 2 array diff ', () => {
    const arr1 = [1,2,3]
    const arr2 = [2,3]

    expect(differenceArray(arr1,arr2)).toEqual([1])
})


it('should get 2 array diff ', () => {
    const arr1 = [2,3]
    const arr2 = [1,2,3]

    expect(differenceArray(arr1,arr2)).toEqual([1])
})


it('should get 2 array diff symmetric part1 ', () => {
    const arr1 = [1]
    const arr2 = []

    expect(differenceArray(arr1,arr2)).toEqual([1])
})



it('should get 2 array diff symmetric part2 ', () => {
    const arr1 = []
    const arr2 = [1]

    expect(differenceArray(arr1,arr2)).toEqual([1])
})
