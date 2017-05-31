import TypeDate from './TypeDate';
import TypeString from './TypeString';
import TypeNumber from './TypeNumber';
import TypeBoolean from './TypeBoolean';
import { PropTypes } from 'react';
const DataTypes = {
    TypeDate: new TypeDate(),
    TypeString: new TypeString(),
    TypeNumber: new TypeNumber(),
    TypeBoolean: new TypeBoolean()
};

DataTypes.PropTypes = PropTypes.oneOf([
    DataTypes.TypeDate,
    DataTypes.TypeString,
    DataTypes.TypeNumber,
    DataTypes.TypeBoolean
]);

export default DataTypes;
