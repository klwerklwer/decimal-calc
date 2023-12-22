function numberText( value , { toFixed , doFormat = true , show0 = false } = {} ){
	value = ( +value ).toFiniteNumber()
	let decimalString = value.toString()
	if( /e/.test( decimalString ) ){
		console.info( value , "超过正常数字, 无法格式化")
		return ""
	}

	decimalString = decimalString.replace( /^-?\d+\.?/ , '' )

	let intString = Math.trunc( value ), 
	doFixed = isFinite( toFixed ) && toFixed >= 0 && decimalString.length != toFixed

	if( doFixed ){
		decimalString = decimalString.substr( 0 , toFixed )
		if( decimalString.length < toFixed ) decimalString = decimalString.padEnd( toFixed , 0 )
	}
	if( decimalString ){
		decimalString = "." + decimalString
	}

	if( doFormat && intString.toString().length > 3 ) intString = intString.toLocaleString()
	
	let v1 = intString + decimalString , v2 = Number( v1 )
	if( v2 == 0 ){
		if( !show0 ){
			return ""
		}
	}
	else if( intString == 0 && value < 0 ){
		v1 = "-"+v1
	}
	return v1
}
//用于高精度浮点型运算扩展
(function(){
	function exponential( a ){
		if( Number.isInteger( a ) ){
			return [ a , 0 ]
		}
		a = a.toString()
		if( /e/.test( a ) ){
			a = a.match( /(\-?\d+)(\.(\d+))?e\+?(\-?\d+)/ )
			if( a[3] ){
				return [ a[1] + a[3] , a[3].length - a[4] ]
			}
			return [ +a[1] , -a[4] ]
		}
		else{
			a = a.split(".")
			return [ +(a[0] + a[1]) , a[1].length ]
		}
	}
	Number.prototype.toFiniteNumber = function(){
		return isFinite( this ) ? this.valueOf() : 0
	}
	Number.prototype['*'] = function( b ){
		b = ( +b ).toFiniteNumber()
		const a = this.toFiniteNumber()
		if( Number.isInteger( a ) && Number.isInteger( b ) ) return a * b
		const [ a_int , a_p ] = exponential( a ),
		[ b_int , b_p ] = exponential( b )
		return a_int * b_int / 10**( a_p + b_p )
	}
	Number.prototype["/"] = function( b ) {
		b = ( +b ).toFiniteNumber()
		const a = this.toFiniteNumber()
		if( Number.isInteger( a ) && Number.isInteger( b ) ) return (a / b).toFiniteNumber()
		const [ a_int , a_p ] = exponential( a ),
		[ b_int , b_p ] = exponential( b )
		return (+(a_int / b_int + "e" + ( b_p - a_p ))).toFiniteNumber()
	}
	Number.prototype['+'] = function( b ) {
		b = ( +b ).toFiniteNumber()
		const a = this.toFiniteNumber()
		if( Number.isInteger( a ) && Number.isInteger( b ) ) return a + b
		let [ a_int , a_p ] = exponential( a ),
		[ b_int , b_p ] = exponential( b ),
		c
		if( a_p > b_p ){
			c = a_p
			b_int *= 10**( a_p - b_p )
		}
		else{
			c = b_p
			a_int *= 10**( b_p - a_p )
		}
		return ( a_int + b_int ) / 10**c
	}
	Number.prototype['-'] = function( b ) {
		b = ( +b ).toFiniteNumber()
		const a = this.toFiniteNumber()
		if( Number.isInteger( a ) && Number.isInteger( b ) ) return a - b
		let [ a_int , a_p ] = exponential( a ),
		[ b_int , b_p ] = exponential( b ),
		c
		if( a_p > b_p ){
			c = a_p
			b_int *= 10**( a_p - b_p )
		}
		else{
			c = b_p
			a_int *= 10**( b_p - a_p )
		}
		return ( a_int - b_int ) / 10**c
	}
	for( let k of [ "round" , "ceil" , "floor" ] ){
		Number.prototype[ k ] = function( s ){
			let a = this.toFiniteNumber()
			if( !a ){
				return a
			}
			let [ int_part , float_part ] = a.toExponential().split("e")
			s = (+s).toFiniteNumber()
			float_part = +float_part + s
			a = Math[ k ]( int_part + "e" + float_part )
			let [ int_part2 , float_part2 ] = a.toExponential().split("e")
			return +( int_part2 + "e" + ( +float_part2 - s ))
		}
	}
	Number.prototype.roundDown = function( s ){
		let a = this.toFiniteNumber()
		if( !a ){
			return a
		}
		let [ int_part , float_part ] = a.toExponential().split("e")
		s = (+s).toFiniteNumber()
		a = Math.trunc( int_part + "e" + (+float_part + s ) )
		let [ int_part2 , float_part2 ] = a.toExponential().split("e")
		return +( int_part2 + "e" + ( +float_part2 - s ))
	}
	Number.prototype.toNumberText = function(){
		return numberText( this , ...arguments )
	}
	for( let k of [ 'toFiniteNumber' , '*' , '/' , '+' , '-' , 'round' , 'ceil' , 'floor' , 'roundDown' ]){
		String.prototype[ k ] = function(){
			return ( +this )[ k ]( ...arguments )
		}
	}
})()