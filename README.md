# lydia

TypeScript RFC5545 Parser implementation

### Usage Example
```
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

```


DISCLAIMER: This library, code samples and the documentation are provided "as is" without warranty of any kind, either express or implied. Use at your own risk.

We make makes no warranty that

- the software will meet your requirements
- the software will be uninterrupted, timely, secure or error-free
- the results that may be obtained from the use of the software will be effective, accurate or reliable
- the quality of the software will meet your expectations
- any errors in the software obtained from us will be corrected.

We assume no responsibility for errors or omissions in the software or documentation.