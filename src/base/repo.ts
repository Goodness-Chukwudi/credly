import { Model, ClientSession, UpdateQuery, FilterQuery, UpdateWriteOpResult } from 'mongoose';
import { IQueryOptions } from '../common/interface';

/**
 * An abstract class that provides methods for performing DB queries.
 * Classes(entity repositories) that extends this class:
 * - provide the interface of the mongoose document schema
 * - provide the mongoose model in the constructor
 * - inherit it's database access methods
 * @param {Model<T>} Model A mongoose model on which the query is performed
 * @param {T} interface of the model schema
 * @param {TDocument} interface of the document schema
 */
abstract class Repository<T, TDocument> {
  readonly model: Model<T>;

  constructor(Model: Model<T>) {
    this.model = Model;
  }

  /**
   * Saves document using mongoose's save api.
   * @param {TCreate} data Document to be saved
   * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public save(data: Partial<T>, options: IQueryOptions = {}): Promise<TDocument> {
    const model = new this.model(data);
    return model.save({ session: options.session }) as Promise<TDocument>;
  }

  /**
   * Saves document using mongoose's save api.
   * @param {Partial<T>[]} data Document array to be saved
   * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async saveMany(data: Partial<T>[], options: IQueryOptions = {}) {
    return this.model.insertMany(data, { session: options.session });
  }

  /**
   * Fetches all documents that matches the provided query
   * @param {FilterQuery<T>} query An optional mongo query to fetch documents that matched the filter. Returns all documents if query isn't provided
   * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async find(
    query: FilterQuery<T> = {},
    options: IQueryOptions = {}
  ): Promise<TDocument[] | T[]> {
    query = { $and: [query, { is_deleted: false }] };
    const sortOrder = Object.values(options.sort || { created_at: -1 })[0];
    if (options.cursor) {
      const cursorCondition =
        sortOrder == 1 ? { _id: { $gt: options.cursor } } : { _id: { $lt: options.cursor } };
      query = { $and: [cursorCondition, query] };
    }

    const response = await this.model
      .find(query)
      .sort(options.sort || { created_at: -1 })
      .populate(options.populate || [])
      .select(options.select || [])
      .limit(options.limit || 10)
      .session(options.session || null);

    return response as TDocument[];
  }

  /**
   * Fetches and paginates all documents that matches the provided query
   * @param {FilterQuery<T>} query An optional mongo query to fetch documents that matched the filter. Returns all documents if query isn't provided
   * @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async paginate(query: FilterQuery<T> = {}, options: IQueryOptions = {}) {
    query = { $and: [query, { is_deleted: false }] };

    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 10);
    const skip = (page - 1) * limit;

    const [doc, count] = await Promise.all([
      this.model
        .find(query)
        .sort(options.sort || { created_at: -1 })
        .populate(options.populate || [])
        .select(options.select || [])
        .skip(skip)
        .limit(options.limit || 10)
        .session(options.session || null),

      this.model.countDocuments(query),
    ]);

    const totalPages = Math.ceil(count / limit);
    return {
      page,
      limit,
      count,
      total_pages: totalPages,
      data: doc as TDocument[],
      has_next: page < totalPages,
      next_page: page + 1,
      has_prev: page > 1,
      prev_page: page - 1,
    };
  }

  /**
   * Returns the number of documents that matches the provided query
   * @param {FilterQuery<T>} query An mongo query to match documents.
   */
  public async count(query: FilterQuery<T>): Promise<number> {
    query = { $and: [query, { is_deleted: false }] };

    return await this.model.countDocuments(query);
  }

  /**
   * Fetches a document with the provided id.
   * @param {string} id The object id of the document to be fetched
   *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async findById(id: string, options: IQueryOptions = {}): Promise<TDocument | T> {
    const query = { _id: id, is_deleted: false };

    const response = await this.model
      .findOne(query)
      .populate(options.populate || [])
      .select(options.select || [])
      .session(options.session || null);

    return response as TDocument;
  }

  /**
   * Fetches a document that matched the provided filter.
   * @param {FilterQuery<T>} filter An mongo filter to match the queried documents
   *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async findOne(
    filter: FilterQuery<T> = {},
    options: IQueryOptions = {}
  ): Promise<TDocument | T> {
    const query = { $and: [filter, { is_deleted: false }] };

    const response = await this.model
      .findOne(query)
      .populate(options.populate || [])
      .select(options.select || [])
      .session(options.session || null);

    return response as TDocument;
  }

  /**
   * Updates a document that matches the provided object id
   * @param {string} id The object id of the document to be updated
   * @param {UpdateQuery<T>} update The update to be made
   *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async updateById(
    id: string,
    update: UpdateQuery<T>,
    options: IQueryOptions = {}
  ): Promise<TDocument | T> {
    const query = { _id: id, is_deleted: false };

    const response = await this.model
      .findOneAndUpdate(query, update, { new: true, upsert: options.upsert })
      .select(options.select || [])
      .session(options.session || null);

    return response as TDocument;
  }

  /**
   * Updates a document that matches the provided filter
   * @param {FilterQuery<T>} filter An mongo filter to match the queried documents
   * @param {UpdateQuery<T>} update The update to be made
   *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: IQueryOptions = {}
  ): Promise<TDocument | T> {
    const query = { $and: [filter, { is_deleted: false }] };

    const response = await this.model
      .findOneAndUpdate(query, update, { new: true, upsert: options.upsert })
      .select(options.select || [])
      .session(options.session || null);

    return response as TDocument;
  }

  /**
   * Updates documents that matches the provided filter query
   * @param {FilterQuery<T>} filter An mongo filter to match the queried documents
   * @param {UpdateQuery<T>} update The update to be made
   *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    options: IQueryOptions = {}
  ): Promise<UpdateWriteOpResult> {
    const query = { $and: [filter, { is_deleted: false }] };

    const response = await this.model
      .updateMany(query, update, { upsert: options.upsert })
      .session(options.session || null);

    return response as UpdateWriteOpResult;
  }

  /**
   * Soft deletes any document that matches the provided filter
   * @param {FilterQuery<T>} filter An mongo filter to match the queried documents
   * @param {UpdateQuery<T>} update Additional update to be made to the document
   *  @param {IQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async deleteOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T> = {},
    options: IQueryOptions = {}
  ): Promise<TDocument | T> {
    const query = { $and: [filter, { is_deleted: false }] };
    update = { ...update, is_deleted: true, deleted_at: new Date() };

    const response = await this.model
      .findOneAndUpdate(query, update, { new: true })
      .select(options.select || [])
      .session(options.session || null);

    return response as TDocument;
  }

  /**
   * Deletes the document with the id
   * @param {string} query ObjectId of the document to be deleted
   *  @param {IIQueryOptions} options An optional object containing parameters that can be passed to the mongoose query
   */
  public async destroyById(id: string, session?: ClientSession): Promise<T> {
    const query = { _id: id, is_deleted: false };
    const response = await this.model
      .findOneAndDelete(query)
      .lean({ virtuals: true })
      .session(session || null);

    return response as T;
  }
}

export default Repository;
