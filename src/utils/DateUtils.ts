import moment from 'moment-timezone';
import * as rrule from 'rrule';
import { ParameterType } from '../model/ParameterType';
import { IDTProperty, DTType, ITimestampPropery, DTStampType } from '../model/DateTimeTypes';
import { PropertyType, RRuleMetaProps } from '../model/PropertyType';
import { IRawComponent, IRawProperty } from '../model/RawCalendarTypes';
import { ValidationError } from '../CustomErrors';
import { IRRuleProp } from '../model/SimpleTypes';

const UTC_SUFFIX = 'Z';
export class DateUtils {

    public static enrichDTProperty(rawProperty: IRawProperty, defaultTZ?: string): IDTProperty {
        const { value, params, name } = rawProperty;
        let timezone: string | undefined;

        if (!value)
            throw new ValidationError('Missing value for DT property: ' + JSON.stringify(rawProperty));

        if (params && !value.toUpperCase().endsWith(UTC_SUFFIX)) {
            const tzid = params.filter((p) => p.name === ParameterType.TZID);
            timezone = tzid && tzid.length > 0 ? tzid[0].value : defaultTZ;
        }

        const property: IDTProperty = {
            type: name as DTType,
            timezone,
            value: DateUtils.parseDate(value, timezone)
        };

        return property;
    }

    public static entrichTSProperty(rawProperty: IRawProperty, defaultTZ?: string): ITimestampPropery {
        const { value, params, name } = rawProperty;
        let timezone: string | undefined;

        if (!value)
            throw new ValidationError('Missing value for DT property: ' + JSON.stringify(rawProperty));

        if (params && !value.toUpperCase().endsWith(UTC_SUFFIX)) {
            const tzid = params.filter((p) => p.name === ParameterType.TZID);
            timezone = tzid && tzid.length > 0 ? tzid[0].value : defaultTZ;
        }

        return {
            value: DateUtils.parseDate(value, timezone),
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

    public static getOccurences(rruleProp: IRRuleProp, start: Date, end: Date) {
        const ruleSet: rrule.RRuleSet = rruleProp.rruleSet;
        const dates: Date[] = ruleSet.between(start, end);
        return dates;
    }
}
