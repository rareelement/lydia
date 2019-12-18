import moment from 'moment-timezone';
import * as rrule from 'rrule';
import { ParameterType } from '../model/ParameterType';
import { IDTProperty, DTType, ITimestampPropery, DTStampType } from '../model/DateTimeTypes';
import { PropertyType, RRuleMetaProps } from '../model/PropertyType';
import { IRawComponent, IRawProperty } from '../model/RawCalendarTypes';
import { ValidationError } from '../CustomErrors';
import { IRRuleProp } from '../model/SimpleTypes';


export class DateUtils {

    public static enrichDTProperty(rawProperty: IRawProperty): IDTProperty {
        const { value, params, name } = rawProperty;
        let timezone: string | undefined;

        if (!value)
            throw new ValidationError('Missing value for DT property: ' + JSON.stringify(rawProperty));


        if (params) {
            const tzid = params.filter((p) => p.name == ParameterType.TZID);
            timezone = tzid && tzid.length > 0 ? tzid[0].value : undefined;
        }

        const property: IDTProperty = {
            type: name as DTType,
            timezone,
            value: DateUtils.parseDate(value, timezone)
        };

        return property;
    }

    public static entrichTSProperty(rawProperty: IRawProperty): ITimestampPropery {
        const { value, name } = rawProperty;
        if (!value)
            throw new ValidationError('Missing value for DT property: ' + JSON.stringify(rawProperty));

        return {
            value: DateUtils.parseDate(value),
            type: name as DTStampType
        };
    }

    public static createRuleSet({ properties }: IRawComponent): rrule.RRuleSet | undefined {
        // rrulestr('DTSTART:20120201T023000Z\nRRULE:FREQ=MONTHLY;COUNT=5\nRDATE:20120701T023000Z,
        // 20120702T023000Z\nEXRULE:FREQ=MONTHLY;COUNT=2\nEXDATE:20120601T023000Z')
        const rruleConfig = [];
        let containsRule: boolean = false;

        for (const p of properties) {
            // console.log(p.name);
            if (RRuleMetaProps.has(p.name as PropertyType)) {
                rruleConfig.push(p);
            }
            if (p.name === PropertyType.RRULE)
                containsRule = true;
        }

        if (containsRule) {
            const serialized = rruleConfig.map((p) => p.name + ':' + p.value).join('\n');
            const rruleSet: rrule.RRuleSet = rrule.rrulestr(serialized) as rrule.RRuleSet;
            return rruleSet;
        }

        return undefined;
    }

    // DTEND;TZID=America/New_York:19980119T030000
    public static parseDate(value: string, tz?: string) {
        return tz ? moment.tz(value, 'YYYYMMDDTHHmmZZ', tz).toDate() : moment(value).toDate();
    }

    public static getOccurences(rrule: IRRuleProp, start: Date, end: Date){
        const ruleSet: rrule.RRuleSet = rrule.rruleSet;
        const dates: Date[] = ruleSet.between(start, end);
        return dates;
    }

    // public static parseDateComponent({ properties }: IRawComponent, type: PropertyType) {
    //     if (!properties)
    //         return undefined;

    //     const _prop = properties.filter((p) => p.name === type);

    //     // tslint:disable-next-line:variable-name
    //     if (_prop && _prop.length > 0) {
    //         const dt = _prop[0];
    //         // tslint:disable-next-line:variable-name
    //         const _tz = dt.params && dt.params.filter((p) => p.name === ParameterType.TZID);
    //         const tz = _tz && _tz.length > 0 ? _tz[0].value : undefined;

    //         // if (tz) {
    //         //     console.log(dt.value, tz,
    //         //         moment(DateUtils.parseDate(dt.value)).format('YYYYMMDDTHHmmZZ'),
    //         //         moment(DateUtils.parseDate(dt.value, tz)).format('YYYYMMDDTHHmmZZ'));
    //         // }
    //         return this.parseDate(dt.value, tz);
    //     }

    //     return undefined;
    // }
}
