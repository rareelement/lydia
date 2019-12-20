import * as fs from 'fs';
import * as path from 'path';

import { ComponentType } from './../src/model/ComponentType';
import { CalendarParser } from './../src/CalendarParser';
import { Calendar } from './../src/Calendar';
import { IRawComponent } from '../src/model/RawCalendarTypes';
import { PropertyType } from '../src/model/PropertyType';
import { DateUtils } from '../src/utils/DateUtils';

const source = './samples/sample.ics';

test('Parsing simple file', async () => {
    const filename = path.resolve(__dirname, source);
    if (!fs.existsSync(filename))
        throw new Error(`File ${filename} doesn't exists`);

    const rawCalendar = await CalendarParser.parseFile(filename);
    expect(rawCalendar.properties).toBeTruthy();

    const defaultTZ = rawCalendar.properties.filter((p) => p.name === PropertyType.X_WR_TIMEZONE);
    expect(defaultTZ).toBeTruthy();
    expect(defaultTZ.length).toBe(1);
    expect(defaultTZ[0].value).toBe('America/Toronto');

    const calendar = new Calendar(rawCalendar);
    console.log('Calendar components: ' + rawCalendar.components.length);
    console.log('Calendar properties: ' + rawCalendar.properties.length);

    const allEvents = new Map<number, IRawComponent>();

    for (const c of calendar.iterator()) {
        if (c.getName() === ComponentType.VEVENT) {
            const rrule = c.getRRule();
            if (rrule) {
                const occurences: Date[] | undefined = rrule.rruleSet.between(new Date("1980"), new Date("2019"));
                // console.log("occurences", occurences);
            }
            const start = c.getStart();
            const end = c.getEnd();

            // dates.forEach((d)=>allEvents.set(d, c));
        }
    }

    const events = calendar.getEvents({ start: new Date("1980"), end: new Date("2019") });

    expect(events).toBeTruthy();
    expect(events.length).toBeGreaterThan(1);

    const researchEvents = events.filter((t) => t[1].getSummary() === 'Research and Industrial Track  - Abstract Submission');
    expect(researchEvents).toBeTruthy();
    expect(researchEvents.length).toBe(1);

    const researchEvent = researchEvents[0][1];
    expect(researchEvent.getStart().timezone).toBe('America/Toronto');
    expect(researchEvent.getStart().value.getTime()).toBe(DateUtils.parseDate('2015-03-26T04:00:00.000Z').getTime());

    // console.log(events.map((p) => p[0]));
});
