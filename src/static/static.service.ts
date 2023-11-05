import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
@Injectable()
export class StaticService {
    async checkStaticFile(path: string) {
        try {
            const pwd = process.cwd();
            const file = `${pwd}/storage/${path}`;
            // console.log('pwd', pwd);
            //  console.log('file', file);

            await fs.access(file, fs.constants.F_OK);
            const ext = path.split('.').pop();
            return { path: file, ext: ext };
        } catch (err) {
            return { error: err };
        }
    }
}
