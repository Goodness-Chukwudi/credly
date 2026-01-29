import { ClientSession, PopulateOptions, Types } from 'mongoose';

export interface EntityModel {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  /**
   * Converts the entity document into a DTO object.
   * @param keys Array of keys to include. If omitted, all safe fields are returned.
   */
  toDTO<T>(keys: (keyof T)[]): T;
}

interface ErrorMessage {
  code: number;
  message: string;
}

interface IQueryOptions {
  session?: ClientSession;
  select?: string | string[];
  populate?: DbPopulation;
  limit?: number;
  page?: number;
  sort?: DbSortQuery;
  cursor?: string;
  upsert?: boolean;
}

type DbId = string | Types.ObjectId;

type DbSortQuery = Record<string, 1 | -1> | null;
type DbPopulation = PopulateOptions | (string | PopulateOptions)[];

export type {
  ErrorMessage,
  IQueryOptions,
  DbSortQuery,
  DbPopulation,
  DbId,
};
