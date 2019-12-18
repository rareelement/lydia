export enum PropertyType {
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
}

export const RRuleMetaProps = new Set([PropertyType.RRULE, PropertyType.TZID, PropertyType.DTSTART, PropertyType.EXDATE]);
