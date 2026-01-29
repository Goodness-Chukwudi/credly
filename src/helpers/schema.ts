import { Schema, SchemaDefinition, SchemaOptions } from "mongoose";
import { mapTo } from "../common/utils/app_utils";

const createSchema = (
  fields: SchemaDefinition,
  options?: SchemaOptions,
): Schema => {
  if (!fields || Object.keys(fields).length === 0) {
    throw new Error("Please specify this schema's fields");
  }

  const schema = new Schema(
    {
      ...fields,
      deleted_at: { type: Schema.Types.Date },
      is_deleted: { type: Schema.Types.Boolean, default: false },
    },
    {
      toObject: {
        virtuals: true,
        transform: (_, ret) => {
          const doc = ret as Record<string, unknown>;
          doc.id = doc._id;
          delete doc._id;
          delete doc.__v;
          return doc;
        },
      },
      toJSON: {
        virtuals: true,
        transform: (_, ret) => {
          const doc = ret as Record<string, unknown>;
          doc.id = doc._id;
          delete doc._id;
          delete doc.__v;
          return doc;
        },
      },
      ...options,
      minimize: true,
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    },
  );

  schema.methods.toDTO = function <T>(keys: (keyof T)[]): T {
    const obj = this.toObject({ getters: true });
    return mapTo<T>(obj, keys);
  };

  schema.virtual("id").get(function () {
    return this._id.toString();
  });

  return schema;
};

const createSubSchema = (
  fields: SchemaDefinition,
  options?: SchemaOptions,
): Schema => {
  if (!fields || Object.keys(fields).length === 0) {
    throw new Error("Please specify this schema's fields");
  }

  const schema = new Schema(fields, {
    toObject: {
      virtuals: true,
      transform: (_, ret) => {
        const doc = ret as Record<string, unknown>;
        doc.id = doc._id;
        delete doc._id;
        delete doc.__v;
        delete doc.created_at;
        delete doc.updated_at;
        return doc;
      },
    },
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        const doc = ret as Record<string, unknown>;
        doc.id = doc._id;
        delete doc._id;
        delete doc.__v;
        delete doc.created_at;
        delete doc.updated_at;
        return doc;
      },
    },
    ...options,
    minimize: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  });

  schema.virtual("id").get(function () {
    return this._id.toString();
  });

  return schema;
};

type DefaultSchemaFields =
  | "_id"
  | "deleted_at"
  | "is_deleted"
  | "id"
  | "created_at"
  | "updated_at"
  | "toDTO";

const ObjectIdType = { type: Schema.Types.ObjectId, trim: true };
const RequiredObjectIdType = { ...ObjectIdType, required: true };
const TrimmedString = { type: Schema.Types.String, trim: true };
const TrimmedRequiredString = { ...TrimmedString, required: true };
const Email = { ...TrimmedString, lowercase: true };
const UniqueEmail = { ...TrimmedString, lowercase: true, unique: true };
const RequiredEmail = { ...TrimmedRequiredString, lowercase: true };
const UniqueRequiredEmail = {
  ...TrimmedRequiredString,
  lowercase: true,
  unique: true,
};

export {
  createSchema,
  createSubSchema,
  ObjectIdType,
  RequiredObjectIdType,
  TrimmedString,
  TrimmedRequiredString,
  Email,
  UniqueEmail,
  UniqueRequiredEmail,
  RequiredEmail,
};
export type { DefaultSchemaFields };
