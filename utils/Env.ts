import * as dotenv from 'dotenv';
dotenv.config();

export default class Env {
    public static get BASE_URL(): string {
        return process.env.BASE_URL || 'https://www.rakuten.com';
    }

    public static get USERNAME(): string {
        return process.env.USERNAME || '';
    }

    public static get PASSWORD(): string {
        return process.env.PASSWORD || '';
    }
}
