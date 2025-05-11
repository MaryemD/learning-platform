import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionsService {
    getSessionsByCourse(id: number) {
        return Promise.resolve(undefined);
    }
}
