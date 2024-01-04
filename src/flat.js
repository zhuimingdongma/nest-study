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

function flatten (arr, count = 2) {
  while(arr.some(item => Array.isArray(item)) && count > 0) {
    arr = [].concat(...arr)
    count --;
  }
  return arr;
}

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

// test()
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

var a = {
  value:1,
  toString() {
    return this.value ++;
  }
}

if(a == 1 && a == 2 && a == 3) {
  // console.log(1)
}

// var a = 10;
// (function () {
//     console.log(a)
//     a = 5
//     console.log(window.a)
//     var a = 20;
//     console.log(a)
// })()
// undefined
// 10
// 20

// function sleep(time) {
//     return new Promise((resolve, rej) => {
//       setTimeout(() => resolve(), time)
//     })
// }
// console.log(100)
// sleep(1000).then(() => {console.log(200)})

let l = [3, 15, 8, 29, 102, 22]
let l1 = l.sort()
// console.log('l1: ', l1);

var obj = {
  '2': 3,
  '3': 4,
  'length': 2,
  'splice': Array.prototype.splice,
  'push': Array.prototype.push
}
obj.push(1)
obj.push(2)
obj.splice(1, 1)
// console.log(obj)

// (5).add(3).minus(2) 
Number.prototype.add = function(n) {
  return this.valueOf() + n
}

Number.prototype.minus = function(n) {
  return this.valueOf() - n
}

// console.log((5).add(3).minus(2))

var a = {n: 1};
var b = a;
a.x = a = {n: 2};

// console.log(a.x) 	
// console.log(b.x)


// 如下：{1:222, 2:123, 5:888}，请把数据处理为如下结构：[222, 123, null, null, 888, null, null, null, null, null, null, null]。
let o = {1:222, 2:123, 5:888}
function objToArr(obj) {
  const arr = new Array(12).fill(null)
  for (const key in obj) {
      const element = obj[key];
      arr.splice(key - 1, 1, element)
  }
  return arr;
}
// console.log('objToArr: ', objToArr(o));
let arr5 = new Array(12).fill(null).map((_,i)=>{
  _=o[i + 1]
  if (!o[i + 1]) return null
  return _;
})
// console.log('arr: ', arr5);

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
// var intersection = function(nums1, nums2) {
//   nums1 = nums1.sort((a, b) => a - b)
//   nums2 = nums2.sort((a, b) => a - b)
//   let arr2 = nums1.length < nums2.length ? nums1 : nums2;
//   let arr1 = nums1.length < nums2.length ? nums2 : nums1;
//   let result = []
//   let minPoint = 0,maxPoint = 0;
//   while(minPoint < arr2.length && maxPoint < arr1.length) {
//     if (arr2[minPoint] === arr1[maxPoint]) {
//       result.push(arr2[minPoint])
//       minPoint++;
//       maxPoint++;
//     }
//     else if (arr2[minPoint] > arr1[maxPoint]) maxPoint++
//     else minPoint++
//   }
//   return Array.from(new Set(result));
// };

var intersection = function(nums1, nums2) {
  const hash = new Map()
  let arr1 = nums1.length < nums2.length ? nums1 : nums2;
  let arr = nums1.length < nums2.length ? nums2 : nums1;
  let count = 0, result = []
  for (let i = 0; i < arr.length; i++) {
    if (hash.get(arr[i]) !== undefined) {
      hash.set(arr[i], count + 1)
    }
    else hash.set(arr[i], 0)
  }
  
  for (let i = 0; i < arr1.length; i++) {
    if (!result.includes(arr1[i]) && hash.get(arr1[i]) !== undefined) {
      result.push(arr1[i]);
      hash.set(arr1[i], count--)
    }
    else if(hash.get(arr1[i] === 0)) hash.delete(arr1[i])
    else continue;
  }
  return result;
  // return Array.from(new Set(result))
}

let nums1 = [1, 2, 2, 1]
let nums2 = [2, 2]
intersection(nums1, nums2)
// console.log('intersection(nums1, nums2): ', intersection(nums1, nums2));

const array1 = [4,9,5]
const array2 = [9,4,9,8,4]

const result = intersection(array1, array2);
// console.log('result: ', result);

let l3 = new Array(10).fill(null).map(_ => {
  _ = Math.floor(Math.random() * 100)
  return _
}).sort((a, b) => a - b)

let str5 = 'adASjOdapASJO!@#4123123.l124'

// function lowerToUpper(str) {
//   let str1 = ''
//   for (let index = 0; index < str.length; index++) {
//     let element = str[index];
//     if (element === element.toUpperCase()) {
//       element = element.toLowerCase()
//     }
//     else element = element.toUpperCase()
//     str1 += element;
//   }
//   return str1;
// }


function lowerToUpper(str) {
  let str1 = ''
  let unicodeMap = {
    'A': 'A'.charCodeAt(0),
    'Z': 'Z'.charCodeAt(0),
    'z': 'z'.charCodeAt(0),
    'a': 'a'.charCodeAt(0)
  }
  
  let diff = unicodeMap.a - unicodeMap.A;
  
  for (let i = 0; i < str.length; i++) {
    let el = str[i]
    // 大写
    if (unicodeMap.A <= el.charCodeAt(0) && el.charCodeAt(0) <= unicodeMap.Z) {
      el = String.fromCharCode(el.charCodeAt(0) + diff) ;
    }
    // 小写
    else if(unicodeMap.a <= el.charCodeAt(0) && el.charCodeAt(0) <= unicodeMap.z) {
      el = String.fromCharCode(el.charCodeAt(0) - diff);
    }
    else {
      continue;
    }
    str1+= el;
  }
  return str1;
}

const s = 'adASjOdapASJO!@#4123123.l124'.replace(/[a-zA-Z]/g, function(str) {
  return /[a-z]/.test(str) ? str.toUpperCase() : str.toLowerCase()
})

// console.log('lowerToUpper: ', lowerToUpper(str5));

function searchStr(str, search) {
  let left = 0, right = 0, lLength = str.length, rLength = search.length;
  while(left < lLength && right < rLength) {
    if (str[left + right] === search[right]) {
      right++
    }
    else {
      left++
      right = 0;
    }
  }
  return right === search.length ? left : -1;
}

/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
  let left = 0, right = 0, lLength = haystack.length, rLength = needle.length;
  while (left < lLength && right < rLength) {
    if (haystack[left + right] === needle[right]) {
      right++;
    } else {
        left++;
        right = 0;
    }
  }

  return right === needle.length ? left : -1;
};

const str = "Hello, worldeqe!";
const search = "world";

const r = searchStr(str, search);
console.log("搜索结果:", r);

console.log('searchStr: ', searchStr('deadev', 'dev'))
