
import * as connectionsService from './connections.service.js';

export const sendRequest = async (req, res, next) => {
  try {
    const { receiverId, note } = req.body;

    const result = await connectionsService.createConnectionRequest(
      req.user.userId,
      receiverId,
      note
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getConnections = async (req, res, next) => {
  try {
    const result = await connectionsService.fetchUserConnections(
      req.user.userId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const respondToRequest = async (req, res, next) => {
  try {
    const { status } = req.body;

    const result = await connectionsService.updateConnectionStatus(
      req.params.id,
      req.user.userId,
      status
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
