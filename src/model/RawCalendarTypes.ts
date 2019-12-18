export interface IKeyPair {
    name: string;
    value?: string;
}

export interface IRawParam extends IKeyPair {
}

export interface IRawProperty extends IKeyPair {
    params?: IRawParam[];
}

export interface IRawComponent extends IKeyPair {
    properties: IRawProperty[];
}

export interface IRawCalendar {
    components: IRawComponent[];
    properties: IRawProperty[];
}
