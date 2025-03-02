import { prisma } from "./db";

export async function findUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserProfileById(id: string) {
  console.log(id)
  return await prisma.userProfile.findFirst({
    where: {
      userId: id,
    },
  });
}

export async function insertDefaultUser(id: string) {
  return await prisma.userProfile.create({
    data: {
      userId: id,
      duty: "Your Duty on GDGoC Maliki",
      bio: "Your Bio",
      location: "City, Country",
      phone: "Your Phone Number",
      website: "https://yourwebsite.com",
      github: "https://www.github.com",
      twitter: "https://www.twitter.com",
      instagram: "https://www.instagram.com",
      linkedin: "https://www.linkedin.com",
    },
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
