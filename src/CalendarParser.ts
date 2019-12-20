import * as fs from 'fs';
import * as readline from 'readline';
import { SpecialStrings, Helper } from './utils/Helper';
import { IRawProperty, IRawComponent, IRawCalendar } from './model/RawCalendarTypes';
import { PropertyType } from './model/PropertyType';

export class CalendarParser {

    public static parse(lines: string[]): IRawCalendar {
        let currentComponent: IRawComponent | undefined;

        const components: IRawComponent[] = [];
        const properties: IRawProperty[] = [];

        const calendar: IRawCalendar = {
            components,
            properties
        };

        for (const line of lines) {
            if (SpecialStrings.CALENDAR_START === line || SpecialStrings.CALENDAR_END === line) {
                continue;
            }

            if (line.startsWith(SpecialStrings.BEGIN)) {
                const name = line.substr(SpecialStrings.BEGIN.length + 1);
                currentComponent = {
                    name,
                    properties: []
                };
                components.push(currentComponent);

            } else if (line.startsWith(SpecialStrings.END) && line !== PropertyType.X_WR_TIMEZONE) {
                currentComponent = undefined;
            } else {
                const property = Helper.parseLine(line);

                if (currentComponent)
                    currentComponent.properties.push(property);
                else
                    properties.push(property);
            }
        }
        return calendar;
    }

    public static async parseContent(data: string): Promise<IRawCalendar> {
        const temp = data.split(/\r?\n/);
        const lines: string[] = [];

        for (const line of temp) {
            unwrap(lines)(line);
        }

        const calendar = CalendarParser.parse(lines);
        return calendar;
    }

    public static async parseFile(filename: string): Promise<IRawCalendar> {
        return new Promise<IRawCalendar>((resolve, reject) => {

            try {
                const rl = readline.createInterface({ input: fs.createReadStream(filename) });

                const lines: string[] = [];

                rl.on('line',
                    unwrap(lines)
                );

                rl.on('close',
                    () => {
                        const calendar = CalendarParser.parse(lines);
                        resolve(calendar);
                    }
                );
            } catch (err) {
                reject(err);
            }
        });
    }
}

function unwrap(lines: string[]) {
    return (line: string) => {
        if (line.startsWith(' ') || line.startsWith('\t')) {
            line = line.substr(1);
            line = lines.pop() + line;
        }

        if (line) // ignore empty lines
            lines.push(line);
    };
}
