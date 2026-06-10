import { App } from './app';
import { MongoDB } from './database/mongodb';
import dotenv from "dotenv"

dotenv.config()

async function bootstrap() {
    await MongoDB.connect();

    const app = new App();
    app.start();
}

bootstrap();