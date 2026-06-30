import { App } from './app';
import { MongoDB } from './database/mongodb';
import dotenv from "dotenv"
import { UserModel } from './models/user.model';
import bcrypt from 'bcrypt';

dotenv.config()

async function bootstrap() {
    await MongoDB.connect();

    const existingAdmin = await UserModel.findOne({ email: 'marcosgomez100704@gmail.com' });

    if (!existingAdmin) {

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await UserModel.create({
            name: 'marcos',
            email: 'marcosgomez100704@gmail.com',
            password: hashedPassword,
            role: 'ADMIN'
        });

        console.log('Admin user created');
    }

    const app = new App();
    app.start();
}

bootstrap();