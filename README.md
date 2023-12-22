# decimal-calc
js对Number对象方法扩展，用于解决浮点型计算精度问题，包括进位法
##例
```javascript
let a = 1
console.log( a['+']( 1 )['-']( 2 )['*']( 3 )['/']( 4 ) )
```
目前没有实现遵守先乘除后加减的逻辑  
## 额外的扩展方法  
`toFiniteNumber` 转为有限的数字 无法通过 `isFinite`判断的都会转成`0`  
`round`来自`Math`  
`ceil`来自`Math`  
`floor`来自`Math`  
`roundDown`根据参数保留小数位数，多余的直接去掉
