import { IRawCalendar } from './model/RawCalendarTypes';
import { cookComponent } from './utils/Helper';
import { ComponentType } from './model/ComponentType';
import { Component } from './model/Component';

export class Calendar {

    constructor(private readonly rawCalendar: IRawCalendar) {

    }

    public * iterator() {
        const components = this.rawCalendar.components;
        if (!components)
            return;

        for (const c of components) {
            yield cookComponent(c);
        }
    }

    public getEvents({ start, end, limit }: { start: Date; end?: Date; limit?: number; }) {
        const events: [Date, Component][] = [];
        for (const c of this.iterator()) {
            if (c.getType() === ComponentType.VEVENT) {
                const eventStart = c.getStart();
                const eventEnd = c.getEnd();
                // console.log(c.getRaw(), {eventStart, eventEnd});

                if (eventStart.value.getTime() >= start.getTime() &&
                    (!end || eventEnd.value.getTime() <= end.getTime())
                ) {
                    const rrule = c.getRRule();
                    if (rrule) {
                        const occurences: Date[] | undefined = rrule.rruleSet.between(start, end || new Date(-8640000000000000));
                        // console.log("occurences", occurences);
                        if (occurences)
                            events.concat(occurences.map((o) => [o, c]));
                    }
                    else {
                        events.push([eventStart.value, c]);
                    }
                }
            }

            if (limit && events.length >= limit)
                break;
        }

        // sort events

        return events.sort((e1, e2) => e1[0].getTime() - e2[0].getTime());
    }

}