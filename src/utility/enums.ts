interface EnumObject {
    [enumValue: number]: string;
}

export const enumToStringArray = (e: EnumObject): string[] => {
    const stringArray: string[] = [];
    for (const value in e) {
        stringArray.push(e[value]);
    }
    return stringArray;
};
