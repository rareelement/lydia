import { PropertyType } from './PropertyType';
import { IRichProperty } from './SimpleTypes';

export interface IDateTime {
    value: Date;
    timezone?: string;
}

export type DTType = PropertyType.DTSTART | PropertyType.DTEND;

// export const DTTypes = new Set<string>([PropertyType.DTSTART, PropertyType.DTEND]);

export interface IDTProperty extends IDateTime, IRichProperty {
    type: DTType;
    value: Date;
    timezone?: string;
}

export interface ITimestampPropery extends IDateTime, IRichProperty {
    type: DTStampType;
    value: Date;
}

export type DTStampType = PropertyType.DTSTAMP | PropertyType.CREATED | PropertyType.LAST_MODIFIED;
// export const DTStampTypes = new Set<string>([PropertyType.DTSTAMP, PropertyType.CREATED, PropertyType.LAST_MODIFIED]);
