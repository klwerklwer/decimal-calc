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
	for( let k of [ 'toFiniteNumber' , '*' , '/' , '+' , '-' , 'round' , 'ceil' , 'floor' , 'roundDown' ]){
		String.prototype[ k ] = function(){
			return ( +this )[ k ]( ...arguments )
		}
	}
})()
