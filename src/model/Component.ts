import { IRawComponent, IRawProperty } from './RawCalendarTypes';
import { PropertyType } from './PropertyType';
import { IRichProperty, ISummaryProp, IDescriptionProp, IRRuleProp } from './SimpleTypes';
import { CalendarUtils } from '../CalendarUtils';
import { IDateTime } from './DateTimeTypes';
import { ComponentType } from './ComponentType';

export class Component {

    private propertyIndex = new Map<PropertyType, IRichProperty>();

    constructor(private readonly rawComponent: IRawComponent, defaultTZ?: string) {
        const props = rawComponent.properties;

        if (!props)
            return;

        props.forEach((p: IRawProperty) => {
            const rich = CalendarUtils.enrichProperty(p, rawComponent, defaultTZ);
            // console.log("propertyIndex", rich.type)
            if (rich.type !== PropertyType.UNSUPPORTED)
                this.propertyIndex.set(rich.type, rich);
        });
    }

    public getRaw() {
        return this.rawComponent;
    }

    public getName(): string {
        return this.rawComponent.name;
    }

    public getType(): ComponentType {
        return this.rawComponent.name as ComponentType;
    }

    public getSummary(): string | undefined {
        const prop = this.propertyIndex.get(PropertyType.SUMMARY) as ISummaryProp;
        return prop ? prop.value : undefined;
    }

    public getDescription(): string | undefined {
        const prop = this.propertyIndex.get(PropertyType.DESCRIPTION) as IDescriptionProp;
        return prop ? prop.value : undefined;
    }

    public getRRule(): IRRuleProp | undefined {
        const prop = this.propertyIndex.get(PropertyType.RRULE) as IRRuleProp;
        return prop;
    }

    public getEnd() {
        return this.propertyIndex.get(PropertyType.DTEND) as IDateTime;
    }

    public getStart() {
        return this.propertyIndex.get(PropertyType.DTSTART) as IDateTime;
    }
}
