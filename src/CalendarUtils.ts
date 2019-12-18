import { Status, IStatusProp, ITextProp, Transparency, ISequenceProp, ITransparencyProp, IExperimentalProp, IRichProperty, IUnsupportedRichProp, IRRuleProp } from './model/SimpleTypes';
import { PropertyType } from './model/PropertyType';
import { ValidationError, AssertionError } from './CustomErrors';
import { IRawProperty, IRawComponent } from './model/RawCalendarTypes';
import { DateUtils } from './utils/DateUtils';
import { IDTProperty, ITimestampPropery } from './model/DateTimeTypes';
import { Component } from './model/Component';
import * as rrule from 'rrule';

export class CalendarUtils {

    public static enrichComponent(rawComponent: IRawComponent): Component {
        return new Component(rawComponent);
    }

    public static enrichProperty(rawProperty: IRawProperty, rawComponent: IRawComponent): IRichProperty {
        const name = rawProperty.name;

        if (name.startsWith(PropertyType.EXPERIMENTAL_PREFIX))
            return handleExperimental(rawProperty);

        switch (name) {
            case PropertyType.STATUS:
                return handleStatus(rawProperty);
            case PropertyType.UID:
            case PropertyType.DESCRIPTION:
            case PropertyType.LOCATION:
            case PropertyType.SUMMARY:
                return handleText(rawProperty);
            case PropertyType.TRANSP:
                return handleTransparency(rawProperty);
            case PropertyType.SEQUENCE:
                return handleSequence(rawProperty);
            case PropertyType.DTSTART:
            case PropertyType.DTEND:
                return handleDateTime(rawProperty);
            case PropertyType.DTSTAMP:
            case PropertyType.CREATED:
            case PropertyType.LAST_MODIFIED:
                return handleTimestamp(rawProperty);
            case PropertyType.RRULE:
                return handleRRule(rawProperty, rawComponent)
        }

        const unknown: IUnsupportedRichProp = {
            type: PropertyType.UNSUPPORTED,
            rawProperty,
            value: rawProperty.value
        };

        return unknown;
    }
}

function handleDateTime(rawProperty: IRawProperty): IDTProperty {
    const property = DateUtils.enrichDTProperty(rawProperty);
    return property;
}

function handleTimestamp(rawProperty: IRawProperty): ITimestampPropery {
    const property = DateUtils.entrichTSProperty(rawProperty);
    return property;
}

function handleStatus(rawProperty: IRawProperty): IStatusProp {
    const value = rawProperty.value;

    if (!value || !Object.values(Status).includes(value as Status))
        throw new ValidationError('Invalid Status: ' + value);

    const rich: IStatusProp = {
        value: value as Status,
        type: PropertyType.STATUS
    };

    return rich;
}

function handleRRule(rawProperty: IRawProperty, rawComponent: IRawComponent): IRRuleProp {
    const rruleSet: rrule.RRuleSet | undefined = DateUtils.createRuleSet(rawComponent);
    
    if(!rruleSet){
        throw new AssertionError('Empty rule set returned for non empty element');
    }

    const name = rawProperty.name;
    const value = rawProperty.value;

    const rich: IRRuleProp = {
        name,
        value,
        type: PropertyType.RRULE,
        rruleSet
    };

    return rich;

}

function handleText(rawProperty: IRawProperty): ITextProp {
    const name = rawProperty.name;
    const value = rawProperty.value;

    const rich: ITextProp = {
        value,
        type: name as PropertyType
    };

    return rich;
}

function handleTransparency(rawProperty: IRawProperty): ITransparencyProp {
    const value = rawProperty.value;

    if (!value || !Object.values(Transparency).includes(value as Transparency))
        throw new ValidationError('Invalid Transparency: ' + value);

    const rich: ITransparencyProp = {
        value: value as Transparency,
        type: PropertyType.TRANSP
    };

    return rich;
}

function handleSequence(rawProperty: IRawProperty): ISequenceProp {
    const value = rawProperty.value;

    if (!value)
        throw new ValidationError('Missing value for Sequence');

    const parsed: number = parseInt(value);

    if (isNaN(parsed))
        throw new ValidationError('Invalid Sequence: ' + parsed);

    const rich: ISequenceProp = {
        value: parsed,
        type: PropertyType.SEQUENCE
    };

    return rich;
}

function handleExperimental(rawProperty: IRawProperty): IExperimentalProp {
    return {
        type: PropertyType.EXPERIMENTAL_PREFIX,
        name: rawProperty.name,
        rawProperty
    };
}
