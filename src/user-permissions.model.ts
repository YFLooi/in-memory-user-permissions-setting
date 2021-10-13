import mongoose, { Schema, Document } from "mongoose";

export interface IUserPermissions extends Document {
  email: string;
  permissions: { featureName: string; canAccess: boolean }[];
}

const userPermissionsSchema: Schema = new mongoose.Schema(
  {
    email: { type: String },
    permissions: { type: Array },
  },
  { timestamps: true }
);

interface UserPermissionsModelInterface
  extends mongoose.Model<IUserPermissions> {}

export default mongoose.model<IUserPermissions, UserPermissionsModelInterface>(
  "userpermissions",
  userPermissionsSchema
);
