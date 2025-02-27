import { NextFunction, Request, Response } from 'express';
import admin, { FirebaseError } from 'firebase-admin';
import httpStatus from 'http-status';

import config from '../config/env.config';
import { userService } from '../services';
import { catchAsync } from '../utils/helpers';
import ApiError from '../utils/apiError';
import { IStandardUser } from '../models';

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase.projectId,
    clientEmail: config.firebase.clientEmail,
    privateKey: config.firebase.privateKey,
  }),
});

const firebaseAuth = (...allowedUserRoles: Array<UserRole | 'All'>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new ApiError('Please Authenticate!');

    try {
      const payload = await admin.auth().verifyIdToken(token, true);
      const user = await userService.getUserByFirebaseUId(payload.uid);

      // User is not available in mongodb
      if (!user) {
        if (!req.path.includes('register'))
          throw new ApiError("User doesn't exist. Please create an account", httpStatus.NOT_FOUND);

        res.locals.userPayload = payload;
        return next();
      }

      // User is available in mongodb
      if (!allowedUserRoles.includes(user.__t) && allowedUserRoles[0] !== 'All')
        throw new ApiError("Sorry, but you can't access this", httpStatus.FORBIDDEN);

      if ((user as IStandardUser).isBlocked)
        throw new ApiError('User is blocked', httpStatus.FORBIDDEN);

      if ((user as IStandardUser).isDeleted)
        throw new ApiError("User doesn't exist anymore", httpStatus.GONE);

      req.user = user;
      next();
    } catch (err: unknown) {
      if ((err as FirebaseError).code === 'auth/id-token-expired')
        throw new ApiError('Session has been expired', httpStatus.UNAUTHORIZED);

      throw new ApiError('Failed to authenticate', httpStatus.UNAUTHORIZED);
    }
  });

export default firebaseAuth;
