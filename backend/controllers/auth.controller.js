import Customer from "../models/Customer.js";
import Employee from "../models/Employee.js";
import PendingUser from "../models/PendingUser.js"
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import ServiceRequest from "../models/ServiceRequest.js";
import resend from "../utils/resendClient.js";
import { sendVerificationEmail } from "../utils/sendVerficationEmail.js";
dotenv.config();

export const RegisterAuth = async (req, res) => {
  const name = req.body.name?.trim();
  const lastName = req.body.lastName?.trim();
  const password = req.body.password?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const role = req.body.role;
  try {
    if (!name || !lastName || !password || !email || !role) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Correo electrónico no válido" });
    }
    let customer = await Customer.findOne({ email });
    let employee = await Employee.findOne({ email });
    let userPending = await PendingUser.findOne({ email });
    if (customer || employee || userPending) {
      return res.status(400).json({ message: "El correo ya se encuentra registrado" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    const pendingUser = new PendingUser({
      name: name,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      role: role,
      expiresAt: expiresAt,
      token: token
    })
    await pendingUser.save();
    const verificationLink = `http://localhost:5173/verify-email/${token}`;
    await sendVerificationEmail(email, verificationLink)

    res.status(201).json({
      message: "Confirma su correo electronico para continuar con el registro.",
      user: {
        name: name,
        lastName: lastName,
        email: email,
        role: role,
        token: token
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ message: "Error al crear el usuario." });
  }
}

export const LoginAuth = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Correo electrónico no válido" });
    }
    let user = await Customer.findOne({ email });
    let type = "customer";
    if (!user) {
      user = await Employee.findOne({ email });
      type = "employee";
    }
    if (!user) {
      return res.status(401).json({ message: "Correo electronico no registrado." });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "contraseña invalido." });
    }
    const token = jwt.sign({ id: user._id, role: type }, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.status(201).json({
      message: "User logged in successfully",
      token: token,
      role: type,
      id: user._id,
    })
  } catch {
    res.status(500).json({ message: "Invalid email or password" });
  }
}

export const forgotPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  try {
    // Validación básica
    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio." });
    }
    // Buscar usuario en Customer o Employee
    let user = await Customer.findOne({ email });
    if (!user) {
      user = await Employee.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ message: "El correo no está registrado." });
    }

    // Generar token y guardar en usuario
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hora
    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${token}`;

    // Envío del correo
    try {
      const data = await resend.emails.send({
        from: '"support service" <services17@sistemadeservicios.shop>',
        to: email,
        subject: 'Restablece tu contraseña',
        html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Hola ${user.name} 👋</h2>
                <p style="font-size: 16px; color: #555;">
                  Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetLink}" style="padding: 12px 25px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-size: 16px;">
                    Restablecer contraseña
                  </a>
                </div>
                <p style="font-size: 14px; color: #999;">
                  Si no solicitaste este cambio, puedes ignorar este mensaje. Tu contraseña actual seguirá siendo válida.
                </p>
                <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #ccc; text-align: center;">
                  © 2025 Sistema de Servicios. Todos los derechos reservados.
                </p>
              </div>
            `,
      });

      if (!data || data.error) {
        console.error("Fallo al enviar correo:", data.error);
        return res.status(500).json({ message: "No se pudo enviar el correo. Intenta más tarde." });
      }

    } catch (error) {
      console.error("Error al enviar correo:", error);
      return res.status(500).json({ message: "Error al enviar el correo." });
    }

    return res.status(200).json({ message: "Correo de recuperación enviado exitosamente." });

  } catch (error) {
    console.error("Error general en forgotPassword:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
}

export const resetPassword = async (req, res) => {
  const { token } = req.body;
  const password = req.body.password?.trim();
  try {
    if (!token) return res.status(400).json({ message: "Token invalido" });
    if (!password) return res.status(400).json({ message: "Por favor, ingrese su password" })

    let user = await Customer.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      user = await Employee.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    }
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();
    res.status(200).json({
      message: "Password actualizado exitosamente!",
    })
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resetting password" });
  }
}

export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const userPending = await PendingUser.findOne({ token });

    if (!userPending) {
      return res.status(400).json({ message: "Token inválido o usuario no encontrado" });
    }

    if (userPending.expiresAt < Date.now()) {
      await PendingUser.deleteOne({ _id: userPending._id });
      return res.status(400).json({ message: "El enlace ha expirado." });
    }

    const { name, lastName, email, password, role } = userPending;

    if (role !== 'customer' && role !== 'employee') {
      return res.status(400).json({ message: "Tipo de usuario no válido." });
    }

    if (role === 'customer') {
      const existingUser = await Customer.findOne({ email });
      if (existingUser) {
        await PendingUser.deleteOne({ _id: userPending._id });
        return res.status(200).json({ success: true, message: "Este correo ya fue verificado previamente." });
      }
      const newCustomer = new Customer({ name, lastName, email, password, role });
      await newCustomer.save();
    }

    if (role === 'employee') {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        await PendingUser.deleteOne({ _id: userPending._id });
        return res.status(200).json({ success: true, message: "Este correo ya fue verificado previamente." });
      }

      const newEmployee = new Employee({ name, lastName, email, password, role });
      await newEmployee.save();
    }

    await PendingUser.deleteOne({ _id: userPending._id });

    return res.status(201).json({
      success: true,
      message: "Correo verificado correctamente.",
    });


  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(400).json({ message: "Este correo ya está registrado." });
    }

    console.error("Error en verificación de correo:", error);
    return res.status(500).json({ message: "Error del servidor al verificar el correo." });
  }
};

export const createRequest = async (req, res) => {
  const { employeeId, description } = req.body;
  const { id: customerId, role } = req.user;

  if (role !== 'customer') {
    return res.status(403).json({ message: "Acceso denegado. Solo los clientes pueden crear solicitudes." });
  }
  try {
    if (!employeeId || !description) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    const request = await ServiceRequest.create({ employeeId, customerId, description });
    res.status(201).json({ message: "Solicitud enviada con exito", request });
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    return res.status(400).json({ message: "Error en los datos enviados" });
  }
}

export const seeRequest = async (req, res) => {
  const { id: employeeId, role } = req.user;
  if (role !== 'employee') {
    return res.status(403).json({ message: "Acceso denegado. Solo los empleados pueden ver solicitudes." });
  }
  try {
    const requests = await ServiceRequest.find({ employeeId }).populate('customerId', 'name lastName email');
    if (requests.length === 0) {
      return res.status(404).json({ message: "No hay solicitudes pendientes." });
    }
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error al obtener las solicitudes:", error);
    res.status(500).json({ message: "Error al obtener las solicitudes." });
  }
}
