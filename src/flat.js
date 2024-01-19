import m from './observer'

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
  // 执行结果有返回值并且是一个对象，返回执行的结果，否侧返回新创建的对象 ret等于被调用函数的返回值
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

const str = "Hello, worldeqe!";
const search = "world";

const r = searchStr(str, search);
// console.log("搜索结果:", r);

// console.log('searchStr: ', searchStr('deadev', 'dev'))

// example 1
// var a={}, b='123', c=123;  
// a[b]='b';
// a[c]='c';  
// console.log(a[b]);

// // example 2
// var a={}, b=Symbol('123'), c=Symbol('123');  
// a[b]='b';
// a[c]='c';  
// console.log(a[b]);

// // example 3
// var a={}, b={key:'123'}, c={key:'456'};  
// a[b]='b';
// a[c]='c';  
// console.log(a[b]);

function rotateList(nums, k) {
  let len = nums.length;
  const list = new Array(len);
  for (let i = 0; i < len; i++) {
    list[(i + k ) % len] = nums[i]
  }
  // for (let i = 0; i < len; i++) {
  //   nums[i] = list[i]
  // }
  return list;
}
// console.log('rotateList: ', rotateList([1, 2, 3, 4, 5, 6, 7], 3));
// abcba
function symmetry(str) {
  if (str.length < 2) return false;
  let left = 0,right = str.length - 1
  while(left < right) {
    if (str[left] === str[right]) {
      left++
      right--
    }
    else {
      return false;
    }
  }
  return true;
}

var isPalindrome = function(x) {
  x = String(Math.abs(x))
if (x.length < 2) return false;
let left = 0,right = x.length - 1
while(left < right) {
  if (x[left] === x[right]) {
    left++
    right--
  }
  else {
    return false;
  }
}
return true;
};
console.log('isPalindrome: ', isPalindrome(-121));


function test() {
  let result = []
  for (let i = 0; i < 10000; i++) {
    if (symmetry(String(i))) {
      result.push(i)
    }
  }
  return result;
}

function moveZero(nums) {
  let left = 0, right = nums.length - 1, count = 0;
  while(left <= right) {
    if (nums[left]===0 ) {
      nums.splice(left, 1)
      count++
    }
    if (nums[right]===0 ) {
      nums.splice(right, 1)
      count++
    }
    if (nums[left] !== 0)
      left++;
    if (nums[right] !== 0)
      right--;
  }
  for (let i = 0; i < count; i++) {
    nums.push(0)
  }
  return nums;
}

function moveZeros(nums) {
  let slow = 0, fast = 0;
  while(fast < nums.length) {
    if (nums[fast] !== 0) {
      let temp = nums[fast]
      nums[fast] = nums[slow]
      nums[slow] = temp
      slow++
    }
    fast++;
  }
  return nums;
} 

// console.log('moveZero: ', moveZeros([0,0,1]));
// console.log('moveZero: ', moveZeros([0,12, 23,0, 56,0,1]));
// console.log('test: ', test());

function add(a, b, c) {
  return a + b + c;
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.call(this, ...args)
    }
    else {
      return function(...moreArgs) {
        return curried(...args,...moreArgs)
      }
    }
  }
}

const curriedAdd = curry(add)
// console.log(curriedAdd(1, 2, 3)); // 输出 6
// console.log(curriedAdd(1)(2, 3)); // 输出 6
// console.log(curriedAdd(1, 2)(3)); // 输出 6
// console.log(curriedAdd(1)(2)(3)); // 输出 6
// nums = [2,11,15, 7], target = 9
// var twoSum = function(nums, target) {
//   let slow = 0, fast = 1, len = nums.length ;
//   while(slow < len - 1) {
//     let diff = target - nums[slow]
//     while (fast < len) {
//       if (diff === nums[fast]) return [slow, fast]
//       if (diff !== nums[fast]) {
//         fast++;
//         // fast++后 依然进入循环
//       }
//     }
//       slow++;
//       fast=slow+1;
//   }
//   return []
// };

var twoSum = function(nums, target) {
  const map = {}
  for (let i = 0; i < nums.length; i++) {
    let el = nums[i]
    let diff = target - el;
    if (map.hasOwnProperty(diff)) {
      return [map[diff], i]
    }
    map[el] = i
  }
  return []
}
// console.log('twoSum: ', twoSum([2,7,11,15], 9));

var twoSum = function(nums, target) {
  let len = nums.length - 1, map = {};
  for (let i = 0; i < len; i++) {
    let diff = target - nums[i]
    if (map.hasOwnProperty(diff)) {
      return [map[nums[i]], i]
    }
    map[nums[i]] = i;
  }
}
let list6 =[
  {id:1,name:'部门A',parentId:0},
  {id:2,name:'部门B',parentId:0},
  {id:3,name:'部门C',parentId:1},
  {id:4,name:'部门D',parentId:1},
  {id:5,name:'部门E',parentId:2},
  {id:6,name:'部门F',parentId:3},
  {id:7,name:'部门G',parentId:2},
  {id:8,name:'部门H',parentId:4}
];

function convert(list) {
  const map = new Map()
  let tree = []
  for (let index = 0; index < list.length; index++) {
    const node = list[index];
    map.set(node.id, node)
    node.children = []
  }
  for (let index = 0; index < list.length; index++) {
    const node = list[index];
    if (node.parentId !== 0) {
      map.get(node.parentId).children.push(node)
    }
    else {
      tree.push(node)
    }
  }
  return tree;
}

// console.log('convert: ', convert(list6));

// function Foo() {
//   Foo.a = function() {
//       console.log(1)
//   }
//   this.a = function() {
//       console.log(2)
//   }
// }
// Foo.prototype.a = function() {
//   console.log(3)
// }
// Foo.a = function() {
//   console.log(4)
// }
// Foo.a();
// let obj1 = new Foo();
// obj1.a();
// Foo.a();

// function revertNum(num) {
//   const str = String(num)
//   return str.length <= 1 ? str : revertNum(str.substring(1)) + str.substring(0, 1)
// }
// console.log('revertNum: ', revertNum(23536));

// const value = '112'
// [1,3] [2]
// var findMedianSortedArrays = function(nums1, nums2) {
//   let left = 0;right = 0, lLength = nums1.length, rLength = nums2.length, middle;
//   if (((lLength + rLength) % 2) !== 0) {
//     middle = Math.floor(((lLength+ rLength) / 2)) + 1
//   }
//   else {
//     middle = Math.floor(((lLength+ rLength) / 2))
//   }
//   while(left < right) {
//     let middle = Math.floor((left + right) / 2)
//     if (lLength[middle] === nums2) return middle;
//     // 右侧
//     if (arr[left] < arr[middle]) {
//       left = middle + 1;
//     }
//     else {
//       right = middle - 1;
//     }  
//   }
// };

// console.log('findMedianSortedArrays: ', findMedianSortedArrays([1, 2], [3, 4]));


// var findMedianSortedArrays = function(arr, nums2) {
//   let left = 0;right = arr.length - 1;
//   while(left < right) {
//     let middle = Math.floor((left + right) / 2)
//     console.log('middle: ', middle);
//     if (arr[middle] === nums2) return middle;
//     // 右侧
//     if (arr[left] < arr[middle]) {
//       left = middle + 1;
//     }
//     else {
//       right = middle - 1;
//     }  
//   }
// };

// console.log('findMedianSortedArrays: ', findMedianSortedArrays([1,3, 5, 6, 10], 6));
var activeEffect = null;
function effect(fn) {
  activeEffect = fn
  activeEffect()
  activeEffect = null
}

var depsMap = new WeakMap()
function gather(target, key) {
  if (!activeEffect) return;
  let depMap = depsMap.get(target)
  if(!depMap) {
    depsMap.set(target, (depMap = new Map()))
  }
  let dep = depMap.get(key)
  if (!dep) {
    depMap.set(key, (dep = new Set()))
  }
  dep.add(activeEffect)
}

function update(target, key) {
  let depMap = depsMap.get(target)
  if (depMap) {
    depMap.get(key)?.forEach((effect) => effect())
  }
}

function reactive(target) {
  const handler = {
    get(target, key, receiver) {
      gather(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      Reflect.set(target,key, value, receiver)
      update(target, key)
    }
  }
  return new Proxy(target, handler)
}

function ref(name) {
  return reactive({
    value:name
  })
}

let a10 = {}
let o1 = []
// console.log('a.toString(): ', a10.toString());
// console.log('o1.toString(): ', o1.toString());
// console.log('a.valueOf(): ', a10.valueOf());
// console.log('o1.valueOf(): ', o1.valueOf());

Function.prototype.myCall = function (ctx, ...args) {
  if (!ctx || ctx === null) {
    ctx = window;
  }
  const fn = Symbol();
  ctx[fn] = this;
  let result = ctx[fn](...args) 
  delete ctx[fn]
  return result;
}

Function.prototype.myApply = function(ctx, args) {
  if (ctx === null || !ctx) {
    ctx = window
  }
  let fn = Symbol()
  ctx[fn] = this;
  let result = ctx[fn](...args)
  delete ctx[fn]
  return result;
}

Function.prototype.myBind = function(ctx) {
  let args = Array.prototype.slice.call(arguments, 1)
  
  function FNOP() {}
  
  let _this = this;
  var result = function() {
    let arg = Array.prototype.slice.apply(arguments)
    args.push.apply(args, arg)
    // 将bind绑定后的函数作为构造函数使用时
    return _this.apply(this instanceof FNOP ? this : ctx, args)
  }
  
  if(this.prototype) {
    FNOP.prototype = this.prototype
  }
  result.prototype = new FNOP()
  return result;
}

const getFetch = (nums) => {
  return new Promise((resolve, rej) => {
    setTimeout(() => {
      resolve(nums + 1)
    }, 1000)
  })
}

function* gen() {
  let res1 = yield getFetch(2)
  let res2 = yield getFetch(res1)
  let res3 = yield getFetch(res2)
  return res3;
}

function myAsync(generator) {
  // return function() {
    return new Promise((resolve, reject) => {
      let gen = generator();
    
      let next = (context) => {
        let result
        try {
          result = gen.next(context)
          let {done,value} = result;
          if (done) {
            resolve(value)
          }
          else {
            return Promise.resolve(value).then(val => next(val)).catch(err => next(err))
          }
          }
          catch(err) {
            reject(err)
          }
      }
      next()
    })
  // }
}

function InstanceOf(L, R) {
  if (typeof L === 'number' || typeof L === 'string' || typeof L === 'boolean' || L === undefined) return false;
  let lPrototype = Object.getPrototypeOf(L), rPrototype = R.prototype;
  while(lPrototype !== null) {
    if (lPrototype === rPrototype) return true;
    else {
      lPrototype = Object.getPrototypeOf(lPrototype);
    }
  }
  return false;
}

function debounce(fn, time) {
  let timer
  return function() {
    clearTimeout(timer)
    let args = Array.prototype.slice.call(arguments)
    timer = setTimeout(() => fn.call(this,args), time)
  }
}

function throttle(fn, time) {
  let timer;
  return function() {
    let args = arguments;
    timer = setTimeout(() => {
      clearTimeout(timer)
      return fn.apply(this, args)
    }, time)
  }
}


m = 21
console.log('m: ', m);