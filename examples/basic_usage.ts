import axios from 'axios';
import { Calendar, CalendarParser, Component } from '@rareelements/lydia';

const instance = axios.create({
    baseURL: 'https://calendar.google.com/calendar/ical/',
    timeout: 20000,
});

async function loadCalendar(): Promise<(Calendar | undefined)> {
    try {
        const result = await instance.get('<CALENDAR_NAME>/public/basic.ics');
        const { data } = result;

        const rawCalendar = await CalendarParser.parseContent(data);
        return new Calendar(rawCalendar);

    } catch (err) {
        console.error('Failed to load calendar', err);
        return undefined;
    }
}

(async () => {

    try {
        const calendar: Calendar | undefined = await loadCalendar();
        if (!calendar) {
            return undefined;
        }

        const eventMap: Array<[Date, Component]> = calendar.getEvents({ start: new Date(), limit: 12 });

        eventMap
            .map(
                (entry) => ({
                    start: entry[1].getStart().value,
                    end: entry[1].getEnd().value,
                    description: entry[1].getDescription(),
                    summary: entry[1].getSummary()
                })
            )
            .forEach(
                ({ description, start, end, summary }) => console.log(description, 'starts', start, 'ends', end, summary)
            )
    }
    catch (err) {
        console.error('Failed to load calendar', err);
    }
}
)();
