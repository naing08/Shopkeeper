import FilterOperator from './FilterOperator';

const FilterOperators={
	Equal:new FilterOperator("Equal",'$eq'),
	NotEqual:new FilterOperator("Not Equal",'$ne'),
	GreaterThan:new FilterOperator("Greater Than",'$gt'),
	GreaterThanOrEqual:new FilterOperator("Greater Than or Equal",'$gte'),
	LessThan:new FilterOperator("Less Than",'$lt'),
	LessThanOrEqual: new FilterOperator("Less Than or Equal",'$lte'),
	Between: new FilterOperator("Between",'$between'),
	NotBetween:new FilterOperator("Not Between",'$notBetween'),
	Blank: new FilterOperator("Blank",'$isNull'),
	NotBlank:new FilterOperator("Not Blank",'$isNotNull'),
	In: new FilterOperator("In",'$in'),
	NotIn: new FilterOperator("Not In",'$notIn'),
	Contain:new FilterOperator("Contain",'$contain'),
	StartWith:new FilterOperator("Start With",'$startWith'),
	EndWith:new FilterOperator("End With",'$endWith'),
	NotContain:new FilterOperator("Not Contain",'$notContain'),
	NotStartWith: new FilterOperator("Not Start With",'$notStartWith'),
	NotEndWith: new FilterOperator("Not End With",'$notEndWith')
};
export default FilterOperators;