# decimal-calc
js对Number对象方法扩展，用于计算浮点型
##例
```javascript
let a = 1
console.log( a['+']( 1 )['-']( 2 )['*']( 3 )['/']( 4 ) )
```
目前没有实现遵守先乘除后加减的逻辑  
额外的扩展方法  
`toFiniteNumber` 转为有限的数字 无法通过 `isFinite`判断的都会转成`0`
