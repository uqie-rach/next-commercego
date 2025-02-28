import { prisma } from "./db";

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function createUser(name: string, email: string, password: string) {
  return await prisma.user.create({
    data: { name, email, password },
  });
}

export async function updateUserRole(userId: string, role: string) {
  return await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
}

export async function deleteUser(userId: string) {
  return await prisma.user.delete({
    where: { id: userId },
  });
}
