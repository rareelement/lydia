import * as fs from 'fs';
import * as path from 'path';

import { ComponentType } from './../src/model/ComponentType';
import { CalendarParser } from './../src/CalendarParser';
import { Calendar } from './../src/Calendar';
import { IRawComponent } from '../src/model/RawCalendarTypes';

const source = './samples/sample.ics';

test('Parsing simple file', async () => {
    const filename = path.resolve(__dirname, source);
    if (!fs.existsSync(filename))
        throw new Error(`File ${filename} doesn't exists`);

    const rawCalendar = await CalendarParser.parseFile(filename);
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

    console.log(events.map((p)=>p[0]));
});
