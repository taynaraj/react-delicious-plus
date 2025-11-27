import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env';
import prisma from '../../../shared/libs/prisma';
import { AppError } from '../../../middlewares/errorHandler';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export class AuthService {

  async register(data: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,   // ✔ CORRETO
      },
      select: {
        id: true,
        name: true,
        email: true,
      }
    });

    // Generate token
    const token = this.generateToken(user.id, user.email, user.name);

    return {
      user,
      token,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash   // ✔ CORRETO — ANTES user.password (errado)
    );

    if (!isValidPassword) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate token
    const token = this.generateToken(user.id, user.email, user.name);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  private generateToken(userId: string, email: string, name: string): string {
    return jwt.sign(
      { userId, email, name },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }
}
