// pages/api/user/[userId].ts
import { prisma } from '@/lib/mongo/db'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query // Ambil userId dari URL

  const id = Array.isArray(userId) ? userId[0] : userId;

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profile: {
          select: {
            phone: true,
            duty: true,
            bio: true,
            location: true,
            linkedin: true,
            github: true,
            twitter: true,
            website: true,
            instagram: true,
          }
        }
      }
    });

    res.status(200).json({ message: `Fetching user with ID: ${userId}`, user })
  } else if (req.method === 'PUT') {
    const { name, email, duty, phone, image, bio, location, linkedin, github, twitter, website, instagram } = req.body;

    console.log(req.body)
    const user = await prisma.user.findUnique(
      {
        where: {
          id
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          profile: {
            select: {
              phone: true,
              duty: true,
              bio: true,
              location: true,
              linkedin: true,
              github: true,
              twitter: true,
              website: true,
              instagram: true,
            }
          }
        }
      },
    );

    await prisma.user.update({
      where: {
        id
      },
      data: {
        name: name || user?.name,
        email: email || user?.email,
        image: image || user?.image,
      }
    })

    await prisma.userProfile.update({
      where: {
        userId: id
      },
      data: {
        phone: phone || user?.profile?.phone,
        duty: duty || user?.profile?.duty,
        bio: bio || user?.profile?.bio,
        location: location || user?.profile?.location,
        linkedin: linkedin || user?.profile?.linkedin,
        github: github || user?.profile?.github,
        twitter: twitter || user?.profile?.twitter,
        website: website || user?.profile?.website,
        instagram: instagram || user?.profile?.instagram,
      }
    })

    res.status(200).json({ message: `Updated!` })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
