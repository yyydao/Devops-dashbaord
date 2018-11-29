export const intersectionArray =(arr1,arr2) =>{
    return arr1.filter(x=>arr2.includes(x))
}

export const differenceArray =(arr1,arr2) =>{
    return arr1
        .filter(x => !arr2.includes(x))
        .concat(arr2.filter(x => !arr1.includes(x)));
    // return  arr1.filter(x => !arr2.includes(x));
}
