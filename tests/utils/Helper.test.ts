import { extractEntityName, Helper } from '../../src/utils/Helper';
import { ValidationError } from '../../src/CustomErrors';
import { ComponentType } from '../../src/model/ComponentType';
import { PropertyType } from '../../src/model/PropertyType';
import { ParameterType } from '../../src/model/ParameterType';

test('Extracting valid entity names', () => {
        expect(extractEntityName('PRODID:-//Google Inc//Google Calendar 70.9054//EN')).toBe('PRODID');
        expect(extractEntityName('X-WR-TIMEZONE:America/Toronto')).toBe('X-WR-TIMEZONE');
        expect(extractEntityName('RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU')).toBe('RRULE');
        expect(extractEntityName('DTSTART;TZID=America/Toronto:20191121T190000')).toBe('DTSTART');
        expect(extractEntityName('RECURRENCE-ID;TZID=America/Toronto:20191114T190000')).toBe('RECURRENCE-ID');
        expect(extractEntityName('DESCRIPTION:')).toBe('DESCRIPTION');
        expect(extractEntityName('DESCriPTION:')).toBe('DESCRIPTION');
});

test('Extracting invalid entity names', () => {
        expect(() => extractEntityName('')).toThrow(ValidationError);
        expect(() => extractEntityName('    ')).toThrow(ValidationError);
        expect(() => extractEntityName('    :    ')).toThrow(ValidationError);
        expect(() => extractEntityName('BEGIN')).toThrow(ValidationError);
});

test('Parse DSTART', () => {
        let parsed = Helper.parseLine('DTSTART:20191024T230000Z');
        expect(parsed.name).toBe(PropertyType.DTSTART);
        expect(parsed.value).toBe('20191024T230000Z');

        parsed = Helper.parseLine('DTSTART:19970714T133000');
        expect(parsed.name).toBe(PropertyType.DTSTART);
        expect(parsed.value).toBe('19970714T133000');

        parsed = Helper.parseLine('DTSTART;TZID=America/New_York:19970714T133000');
        expect(parsed.name).toBe(PropertyType.DTSTART);
        expect(parsed.value).toBe('19970714T133000');

        parsed = Helper.parseLine('dtstart;VALUE=DATE:20150228');
        expect(parsed.name).toBe(PropertyType.DTSTART);
        expect(parsed.value).toBe('20150228');
});

test('Parse DSTART', () => {
        let parsed = Helper.parseLine('ORGANIZER;CN=Ivan Denisovan:mailto:ivan.denisovan@example.com');
        expect(parsed.name).toBe(PropertyType.ORGANIZER);
        expect(parsed.value).toBe('mailto:ivan.denisovan@example.com');
        const params = parsed.params;
        expect(params).toBeDefined();
        expect(params && params.length).toBe(1);
        expect(params && params[0].name).toBe(ParameterType.CN);
        expect(params && params[0].value).toBe('Ivan Denisovan');
});

test('Parse RRULE', () => {
        let parsed = Helper.parseLine('RRULE:FREQ=WEEKLY;COUNT=5;INTERVAL=2;BYDAY=WE');
        expect(parsed.name).toBe(PropertyType.RRULE);
        expect(parsed.value).toBe('FREQ=WEEKLY;COUNT=5;INTERVAL=2;BYDAY=WE');
});

test('Parse Experimental', ()=>{
        let parsed = Helper.parseLine('X-MICROSOFT-CDO-ALLDAYEVENT:FALSE');
        expect(parsed.name).toBe('X-MICROSOFT-CDO-ALLDAYEVENT');
        expect(parsed.value).toBe('FALSE');
});
