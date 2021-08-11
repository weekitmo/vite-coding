// 快排
export function quickSort(arr) {
  if (arr.length <= 1) return arr;
  let mid = Math.floor(arr.length / 2);
  let midItem = arr.splice(mid, 1)[0];
  const leftArr = [];
  const rightArr = [];
  for (let i = 0; i < arr.length; i++) {
      let current = arr[i];
      if(current >= midItem) {
          rightArr.push(current);
      } else {
          leftArr.push(current);
      }
  }
  return quickSort(leftArr).concat([midItem], quickSort(rightArr));
}
let arr = [1, 44, 6, 77, 3, 7, 99, 12];
console.log(quickSort(arr));

// [ 1, 3, 6, 7, 12, 44, 77, 99 ]
