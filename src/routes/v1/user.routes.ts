import express from 'express';

import { firebaseAuth, validate } from '../../middlewares';
import { userValidation } from '../../validations';
import { userController } from '../../controllers';

const router = express.Router();

router.get('/me', firebaseAuth('All'), userController.getMe);

router.patch(
  '/me',
  firebaseAuth('All'),
  validate(userValidation.updateMe),
  userController.updateMe
);

router.patch(
  '/me/preferences',
  firebaseAuth('StandardUser'),
  validate(userValidation.updateMyPreferences),
  userController.updateMyPreferences
);

export default router;
