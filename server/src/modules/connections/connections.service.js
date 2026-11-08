
import prisma from '../../config/db.js';

const createError = (message, statusCode, code) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  return error;
};

export const createConnectionRequest = async (senderId, receiverId, note) => {
  if (senderId === receiverId) {
    throw createError('You cannot connect with yourself', 400, 'SELF_REQUEST');
  }

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    select: { id: true },
  });

  if (!receiver) {
    throw createError('Receiver not found', 404, 'USER_NOT_FOUND');
  }

  const existingConnection = await prisma.connection.findFirst({
    where: {
      OR: [
        { userAId: senderId, userBId: receiverId },
        { userAId: receiverId, userBId: senderId },
      ],
    },
  });

  if (existingConnection) {
    throw createError('You are already connected', 409, 'ALREADY_CONNECTED');
  }

  const existingRequest = await prisma.connectionRequest.findFirst({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
  });

  if (existingRequest) {
    throw createError(
      'A connection request already exists between these users',
      409,
      'REQUEST_ALREADY_EXISTS'
    );
  }

  return prisma.connectionRequest.create({
    data: {
      senderId,
      receiverId,
      note: note?.trim() || null,
    },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      note: true,
      status: true,
      createdAt: true,
    },
  });
};

export const fetchUserConnections = async (userId) => {
  const [connections, sentRequests, receivedRequests] = await Promise.all([
    prisma.connection.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        userB: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.connectionRequest.findMany({
      where: { senderId: userId, status: 'PENDING' },
      include: {
        receiver: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),

    prisma.connectionRequest.findMany({
      where: { receiverId: userId, status: 'PENDING' },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    connections,
    sentRequests,
    receivedRequests,
  };
};

export const updateConnectionStatus = async (requestId, userId, status) => {
  if (!['ACCEPTED', 'REJECTED'].includes(status)) {
    throw createError('Invalid request status', 400, 'INVALID_STATUS');
  }

  const request = await prisma.connectionRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw createError('Connection request not found', 404, 'REQUEST_NOT_FOUND');
  }

  if (request.receiverId !== userId) {
    throw createError(
      'You are not authorized to respond to this request',
      403,
      'FORBIDDEN'
    );
  }

  if (request.status !== 'PENDING') {
    throw createError(
      'This request has already been responded to',
      409,
      'REQUEST_ALREADY_RESPONDED'
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.connectionRequest.update({
      where: { id: requestId },
      data: { status },
    });

    if (status === 'ACCEPTED') {
      const [userAId, userBId] = [request.senderId, request.receiverId].sort();

      await tx.connection.create({
        data: {
          userAId,
          userBId,
        },
      });
    }

    return updatedRequest;
  });
};
