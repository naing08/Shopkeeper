class FilterOperator{
	constructor(name,symbol){
		this.name = name;
		this.symbol = symbol;
	}
	getName(){
		return this.name;
	}
	getSymbol(){
		return this.symbol;
	}
}
export default FilterOperator;