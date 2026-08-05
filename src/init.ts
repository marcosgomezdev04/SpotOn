import { App } from './app';
import { MongoDB } from './database/mongodb';
import dotenv from "dotenv";
import { UserModel } from './models/user.model';
import bcrypt from 'bcrypt';

dotenv.config();

async function bootstrap() {
    await MongoDB.connect();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        const existingAdmin = await UserModel.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            await UserModel.create({
                name: 'admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN'
            });

            console.log('Admin user created from environment variables');
        }
    } else {
        console.log('No default admin configured. Set ADMIN_EMAIL and ADMIN_PASSWORD to create one automatically.');
    }

    const app = new App();
    app.start();
}

bootstrap();