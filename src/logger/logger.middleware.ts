import { NextFunction, Request, Response } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    const currentTime = new Date();
    const strippedDay = '0' + currentTime.getDate();
    //format current time to [12:00:00 21-06-2022]
    const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()} ${strippedDay.slice(
        -2,
    )}-${currentTime.getMonth()}-${currentTime.getFullYear()}`;

    console.log(
        `[${formattedTime}] ${method} ${originalUrl} - ${userAgent} ${ip}`,
    );
    next();
}
