import FilterOperators from './FilterOperators';


class TypeString {
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
			FilterOperators.NotIn,
			FilterOperators.Contain,
			FilterOperators.StartWith,
			FilterOperators.EndWith,
			FilterOperators.NotContain,
			FilterOperators.NotStartWith,
			FilterOperators.NotEndWith
		];
	}
}
export default TypeString;