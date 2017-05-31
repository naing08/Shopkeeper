import FilterOperators from './FilterOperators';
class TypeDate {
	getFilterOperators(){
		return [
			FilterOperators.Equal,
			FilterOperators.NotEqual,
			FilterOperators.GreaterThan,
			FilterOperators.GreaterThanOrEqual,
			FilterOperators.LessThan,
			FilterOperators.LessThanOrEqual,
			FilterOperators.Between,
			FilterOperators.NotBetween,
			FilterOperators.Blank,
			FilterOperators.NotBlank
		];
	}
}
export default TypeDate;