import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, link) => {
    try {
        await resend.emails.send({
            from: '"support service" <services17@sistemadeservicios.shop>',
            to: email,
            subject: 'verifica tu correo electrónico',
            html: `
                <html>
                    <body>
                        <h1>Verifica tu correo electronico</h1>
                        <p>Haga clic en el enlace a continuación para verificar su dirección de correo electrónico:</p>
                        <a href=${link}>Verificar Email</a>
                    </body>
                </html>
            `,
        })
} catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
