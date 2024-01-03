var arr = [ [1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14] ] ] ], 10];

// 实现flat
function flat(list, count = 4) {
  let result = []
  for (let i = 0; i < list.length; i++) {
    const element = list[i]
    if (Array.isArray(element) && element.length !== 0 && count > 0) {
      result = result.concat(flat(element));
      count --;
    }
    else {
      result.push(element)
    }
  }
  return Array.from(new Set(result.sort((a, b) => a - b)));
}
console.log('flat: ', flat(arr));
// 实现new函数
function New() {
  const fn = Array.prototype.shift.call(arguments)
  const obj = Object.create(fn.prototype)
  const ret = fn.apply(obj, arguments)
  // ret等于被调用函数的返回值
  return ret instanceof Object ? ret : obj;
}

function test () {
  console.log('start')
   setTimeout(() => {
       console.log('children2')
       Promise.resolve().then(() => {console.log('children2-1')})
   }, 0)
   setTimeout(() => {
       console.log('children3')
       Promise.resolve().then(() => {console.log('children3-1')})
   }, 0)
   Promise.resolve().then(() => {console.log('children1')})
   console.log('end') 
}

test()
// start
// end
// children1
// children2
// children2-1
// children3
// children3-1

// 请把两个数组 ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] 和 ['A', 'B', 'C', 'D']，合并为 ['A1', 'A2', 'A', 'B1', 'B2', 'B', 'C1', 'C2', 'C', 'D1', 'D2', 'D']
let a1 =  ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2']
let a2 = ['A', 'B', 'C', 'D'].map((item) => {
  return item + 3
})
let a3 = a1.concat(a2).sort().map(i => {
  if (i.includes('3')) {
    let r = i.replace('3', '')
    return r;
  }
  else return i
})