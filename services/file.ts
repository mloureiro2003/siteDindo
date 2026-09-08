import * as fs from 'fs';

export class File{
    static getFileContent(fileName: string){
        const rawData = fs.readFileSync(fileName, 'utf-8');
        const parsedData: any[] = JSON.parse(rawData);
        return parsedData;
    }

    static saveFileContent<T>(fileName: string, data: T[]): void {
        const jsonString = JSON.stringify(data, null, 2);
        fs.writeFileSync(fileName, jsonString, 'utf-8');
    }
}