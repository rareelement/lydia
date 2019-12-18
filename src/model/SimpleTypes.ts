import { PropertyType } from './PropertyType';
import { IRawProperty } from './RawCalendarTypes';
import * as rrule from 'rrule';

export enum Status {
    Tentative = 'TENTATIVE',
    Cancelled = 'CONFIRMED',
    Confirmed = 'CANCELLED'
}

export enum Transparency {
    Opaque = 'OPAQUE',
    Transparent = 'TRANSPARENT'
}

export interface IRichProperty {
    value?: any;
    type: PropertyType;
}

export interface IUnsupportedRichProp extends IRichProperty{
    type: PropertyType;
    value?: string;
    rawProperty: IRawProperty;
}
export interface ITextProp extends IRichProperty {
}

export interface IStatusProp {
    type: PropertyType.STATUS;
    value: Status;
}

export interface ITransparencyProp extends IRichProperty {
    type: PropertyType.TRANSP;
    value: Transparency;
}

export interface ISequenceProp extends IRichProperty {
    type: PropertyType.SEQUENCE;
    value: number;
}

export interface IUIDProp extends ITextProp {
    type: PropertyType.UID;
}

export interface IDescriptionProp extends ITextProp {
    type: PropertyType.DESCRIPTION;
}

export interface ILocationProp extends ITextProp {
    type: PropertyType.LOCATION;
}

export interface ISummaryProp extends ITextProp {
    type: PropertyType.SUMMARY;
}

export interface IExperimentalProp extends IRichProperty {
    type: PropertyType.EXPERIMENTAL_PREFIX;
    name: string;
    rawProperty: IRawProperty;
}

export interface IRRuleProp extends IRichProperty {
    name: string;
    type: PropertyType.RRULE;
    rruleSet: rrule.RRuleSet;
 }