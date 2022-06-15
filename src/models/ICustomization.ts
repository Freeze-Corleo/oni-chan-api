import ICustomizationItem from './ICustomizationItem';

interface ICustomization{
    maxPermitted: Number;
    minPermitted: Number;
    minPermittedUnique: Number;
    maxPermittedUnique: Number;
    title: String;
    options: ICustomizationItem[];
} export default ICustomization;