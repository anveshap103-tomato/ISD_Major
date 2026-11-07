
import prisma from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
  const { name, email, password, interests = [] } = userData;

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
  where: { email: normalizedEmail },
});

if (existingUser) {
  const error = new Error('Email is already registered');
  error.statusCode = 409;
  error.code = 'EMAIL_ALREADY_EXISTS';
  throw error;
}

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,

      userInterests: {
        create: interests.map((interest) => {
          const normalizedName = interest.trim();
          const slug = normalizedName.toLowerCase().replace(/\s+/g, '-');

          return {
            interest: {
              connectOrCreate: {
                where: { slug },
                create: {
                  name: normalizedName,
                  slug,
                },
              },
            },
          };
        }),
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

export const authenticateUser = async (credentials) => {
  const { email, password } = credentials;

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return user;
};