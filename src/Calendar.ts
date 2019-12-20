import { IRawCalendar } from './model/RawCalendarTypes';
import { cookComponent } from './utils/Helper';
import { ComponentType } from './model/ComponentType';
import { Component } from './model/Component';
import { PropertyType } from './model/PropertyType';

export class Calendar {
    private defaultTZ?: string;

    constructor(private readonly rawCalendar: IRawCalendar) {
        if (rawCalendar && rawCalendar.properties) {
            const tzProp = rawCalendar.properties.filter((p) => p.name === PropertyType.X_WR_TIMEZONE);
            if (tzProp && tzProp.length === 1)
                this.defaultTZ = tzProp[0].value;
        }
    }

    public * iterator() {
        const components = this.rawCalendar.components;
        if (!components)
            return;

        for (const c of components) {
            yield cookComponent(c, this.defaultTZ);
        }
    }

    public getEvents({ start, end, limit }: { start: Date; end?: Date; limit?: number; }) {
        const events: Array<[Date, Component]> = [];
        for (const c of this.iterator()) {
            if (c.getType() !== ComponentType.VEVENT) {
                continue;
            }

            const eventStart = c.getStart();
            const eventEnd = c.getEnd();
            const rrule = c.getRRule();

            if (rrule) {
                const occurences: Date[] | undefined = rrule.rruleSet.between(start, end || new Date(-8640000000000000));
                // console.log("occurences", occurences);
                if (occurences)
                    occurences.forEach((o) => events.push([o, c]));
            } else if (eventStart.value.getTime() >= start.getTime() &&
                (!end || eventEnd.value.getTime() <= end.getTime())
            ) {
                events.push([eventStart.value, c]);

            }
        }

        events.sort((e1, e2) => e1[0].getTime() - e2[0].getTime());

        if (limit && events.length >= limit) {
            return events.slice(0, limit);
        } else {
            return events;
        }
    }
}
