import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { sendProfileUpdateMail } from './mailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/send-email', async (req: Request, res: Response) => {
    try {
        const { email, subject, message } = req.body;

        // Валидация
        if (!email || !message) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['email', 'message'],
                optional: ['subject']
            });
        }

        // Используем стандартный subject, если не передан
        const emailSubject = subject || 'Новое сообщение от пользователя';

        // Отправляем письмо
        await sendProfileUpdateMail(email, emailSubject, message);

        res.status(200).json({ 
            success: true, 
            message: 'Email sent successfully' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email' 
        });
    }
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

// Корневой эндпоинт
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        service: 'Email Sending Service',
        endpoints: {
            'POST /send-email': {
                body: {
                    email: 'recipient@example.com',
                    subject: 'optional subject',
                    message: 'your message here'
                }
            }
        }
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});