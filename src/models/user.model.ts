import mongoose, { InferSchemaType } from 'mongoose';

import paginate from '../lib/paginate';

// /////////////////////////////// Base User Schema ///////////////////////////////
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    photo: {
      type: {
        key: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      default: null,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    firebaseSignInProvider: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.plugin(paginate);

// /////////////////////////////// Standard User Schema ///////////////////////////////
const standardUserSchema = new mongoose.Schema({
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  preferences: {
    type: {
      notificationsEnabled: Boolean,
      locationShared: Boolean,
    },
    default: {
      notificationsEnabled: false,
      locationShared: false,
    },
  },
});

// /////////////////////////////// Admin Schema ///////////////////////////////
const adminSchema = new mongoose.Schema({});

// /////////////////////////////// Infer types from schemas ///////////////////////////////
type IUser = mongoose.Document &
  InferSchemaType<typeof userSchema> & { __t: UserRole; _id: MongoObjectId };

type IStandardUser = IUser & InferSchemaType<typeof standardUserSchema>;

type IAdmin = IUser & InferSchemaType<typeof adminSchema>;

type IAnyUser = IUser | IStandardUser | IAdmin;

// /////////////////////////////// Models & Discriminators ///////////////////////////////
// /////////////////////////////// ✏️ Update UserRole in types.d.ts if you add more discriminators ///////////////////////////////
const User = mongoose.model<IUser>('User', userSchema);
const StandardUser = User.discriminator<IStandardUser>('StandardUser', standardUserSchema);
const Admin = User.discriminator<IAdmin>('Admin', adminSchema);

export { User, StandardUser, Admin, IUser, IStandardUser, IAdmin, IAnyUser };
