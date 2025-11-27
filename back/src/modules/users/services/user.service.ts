import prisma from '../../../shared/libs/prisma';
import { AppError } from '../../../middlewares/errorHandler';
import { UpdateUserInput } from '../schemas/user.schema';

export class UserService {
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

  async updateMe(userId: string, data: UpdateUserInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        // Note: avatar and themePreference would need to be added to the schema
        // For now, we'll just update the name
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}

