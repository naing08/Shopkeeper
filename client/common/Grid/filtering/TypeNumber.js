import FilterOperators from './FilterOperators';


class TypeNumber {
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
			FilterOperators.NotBlank,
			FilterOperators.In,
			FilterOperators.NotIn
		];
	}
}
export default TypeNumber;