export const unitAndunique = (arr1:string[],arr2:string[])=>{
    const unitArr = [...arr1,...arr2];
    const uniqueArr = [...new Set(unitArr)]
    return uniqueArr;
}