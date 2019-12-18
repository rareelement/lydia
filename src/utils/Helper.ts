import { ValidationError } from '../CustomErrors';
import { IRawParam, IRawProperty, IRawComponent } from '../model/RawCalendarTypes';
import { CalendarUtils } from '../CalendarUtils';
import { Component } from '../model/Component';

export const P_DELIMITER = ';';
export const V_DELIMITER = ':';
export const E_DELIMITER = '=';

export interface IKeyPair {
    name: string;
    value?: string;
}

export class Helper {

    public static parseLine(line: string): IRawProperty {

        const params: IRawParam[] = [];

        let nameEndIndex = 0;

        let valueStartIndex = 0;

        let paramNameStart = 0;
        let paramNameEnd = 0;

        let currentIndex = 0;

        for (const c of line) {
            if ((c === V_DELIMITER || c === P_DELIMITER) && nameEndIndex === 0) {
                nameEndIndex = currentIndex;
            }

            if ((c === P_DELIMITER || c === V_DELIMITER) && paramNameStart > 0) {
                params.push({
                    name: line.substring(paramNameStart, paramNameEnd).toUpperCase(),
                    value: line.substring(paramNameEnd + 1, currentIndex)
                });
                paramNameStart = 0;

            }

            // tslint:disable-next-line:prefer-switch
            if (c === P_DELIMITER) {
                paramNameStart = currentIndex + 1;
            } else if (c === E_DELIMITER) {
                paramNameEnd = currentIndex;
            } else if (c === V_DELIMITER) {
                valueStartIndex = currentIndex + 1;
                break;
            }

            currentIndex++;
        }

        const name = line.substr(0, nameEndIndex).toUpperCase();
        const value = line.substring(valueStartIndex);

        return {
            name,
            value,
            params: params.length > 0 ? params : undefined
        };
    }

    public static unescapeText(value: string) {
        return value
            .replace(/\\[nN]/g, '\n')
            .replace(/\\\\/g, '\\')
            .replace(/\\\,/g, ',')
            .replace(/\\\;/g, ';');
    }

}

export enum SpecialStrings {
    VCALENDAR = 'VCALENDAR',
    BEGIN = 'BEGIN',
    END = 'END',
    VERSION = 'VERSION',
    PROVIDER = 'PROVIDER',
    CALENDAR_START = 'BEGIN:VCALENDAR',
    CALENDAR_END = 'END:VCALENDAR'
}

export function extractEntityName(line: string): string {
    if (!line)
        throw new ValidationError('Empty line. Entity name cannot be extracted ');

    let index = 0;
    for (const c of line) {
        if (c === ':' || c === ';') {
            break;
        }
        index++;
    }

    if (line.length === index)
        throw new ValidationError('Missing delimiter. Cannot extract entity name ' + line);

    const name = line.substr(0, index).toUpperCase();
    if (name.trim() !== name)
        throw new ValidationError('Entity name must not contain spaces: ' + name);

    return name;
}

export function cookComponent(rawComponent: IRawComponent): Component{
    return CalendarUtils.enrichComponent(rawComponent);
}
