import { Injectable } from '@nestjs/common';
import { parseFile } from 'fast-csv';

@Injectable()
export class CsvService {
  async parseCsv<T>(path: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const list: T[] = [];
      const parsedCsv = parseFile(path, { delimiter: ';', headers: true })
        .on('error', (error) => {
          console.error(error);
          reject(error);
        })
        .on('data', (row: T) => {
          // console.log(row);
          list.push(row);
        })
        .on('end', (rowCount: number) => {
          console.log(`Parsed ${rowCount} rows`);
          resolve(list);
        });

      return parsedCsv;
    });
  }
}
