import FilterOperators from './FilterOperators';
class TypeBoolean {
	getFilterOperators(){
		return [
			FilterOperators.Equal,
			FilterOperators.Blank,
			FilterOperators.NotBlank
		];
	}
}
export default TypeBoolean;