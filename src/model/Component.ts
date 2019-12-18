import { IRawComponent, IRawProperty } from './RawCalendarTypes';
import { PropertyType } from './PropertyType';
import { IRichProperty, ISummaryProp, IDescriptionProp, IRRuleProp } from './SimpleTypes';
import { CalendarUtils } from '../CalendarUtils';
import { IDateTime } from './DateTimeTypes';
import { ComponentType } from './ComponentType';

export class Component {

    private propertyIndex = new Map<PropertyType, IRichProperty>();

    constructor(private readonly rawComponent: IRawComponent) {
        const props = rawComponent.properties;

        if (!props)
            return;

        props.forEach((p: IRawProperty) => {
            const rich = CalendarUtils.enrichProperty(p, rawComponent);
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


/*
    ACKNOWLEDGED = 'ACKNOWLEDGED',
    ACTION = 'ACTION',
    ATTACH = 'ATTACH',
    ATTENDEE = 'ATTENDEE',
    BUSYTYPE = 'BUSYTYPE',
    CALSCALE = 'CALSCALE',
    CATEGORIES = 'CATEGORIES',
    CLASS = 'CLASS',
    COMMENT = 'COMMENT',
    COMPLETED = 'COMPLETED',
    CONTACT = 'CONTACT',
    COUNTRY = 'COUNTRY',
    CREATED = 'CREATED',
    DESCRIPTION = 'DESCRIPTION',
    DTEND = 'DTEND',
    DTSTAMP = 'DTSTAMP',
    DTSTART = 'DTSTART',
    DUE = 'DUE',
    DURATION = 'DURATION',
    EXDATE = 'EXDATE',
    EXPERIMENTAL_PREFIX = 'X-',
    EXRULE = 'EXRULE',
    EXTENDED_ADDRESS = 'EXTENDED-ADDRESS',
    FREEBUSY = 'FREEBUSY',
    GEO = 'GEO',
    LAST_MODIFIED = 'LAST-MODIFIED',
    LOCALITY = 'LOCALITY',
    LOCATION = 'LOCATION',
    LOCATION_TYPE = 'LOCATION-TYPE',
    METHOD = 'METHOD',
    NAME = 'NAME',
    ORGANIZER = 'ORGANIZER',
    PERCENT_COMPLETE = 'PERCENT-COMPLETE',
    POSTALCODE = 'POSTAL-CODE',
    PRIORITY = 'PRIORITY',
    PRODID = 'PRODID',
    RDATE = 'RDATE',
    RECURRENCE_ID = 'RECURRENCE-ID',
    REGION = 'REGION',
    RELATED_TO = 'RELATED-TO',
    REPEAT = 'REPEAT',
    REQUEST_STATUS = 'REQUEST-STATUS',
    RESOURCES = 'RESOURCES',
    RRULE = 'RRULE',
    SEQUENCE = 'SEQUENCE',
    STATUS = 'STATUS',
    STREET_ADDRESS = 'STREET-ADDRESS',
    SUMMARY = 'SUMMARY',
    TEL = 'TEL',
    TRANSP = 'TRANSP',
    TRIGGER = 'TRIGGER',
    TZID = 'TZID',
    TZNAME = 'TZNAME',
    TZOFFSETFROM = 'TZOFFSETFROM',
    TZOFFSETTO = 'TZOFFSETTO',
    TZURL = 'TZURL',
    UID = 'UID',
    URL = 'URL',
    VERSION = 'VERSION',
    UNSUPPORTED = 'UNSUPPORTED'
*/