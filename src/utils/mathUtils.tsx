export function roundTo (num:number, decimal:number):number{
    return Math.round( ( num + Number.EPSILON ) * Math.pow( 10, decimal ) ) / Math.pow( 10, decimal );
}