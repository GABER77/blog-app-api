import { Repository } from 'typeorm';
import { QueryBuilderService } from './query-builder.service';

interface GetAllOptions {
  repo: Repository<any>;
  queryParams: Record<string, string>;
  alias: string;
  searchableFields?: string[];
}

export class HandlerFactory {
  static async getAll({
    repo,
    queryParams,
    alias,
    searchableFields = [],
  }: GetAllOptions) {
    // Parse pagination parameters with fallback
    const page = Number(queryParams.page) || 1;
    const limit = Math.min(Number(queryParams.limit) || 10, 20);

    // Create a query builder for the entity
    const qb = repo.createQueryBuilder(alias);

    // Apply a chain of query features
    const modifiedQuery = new QueryBuilderService(qb, queryParams, alias)
      .filter()
      .search(searchableFields)
      .sort()
      .limitFields()
      .paginate(page, limit)
      .getQuery();

    // 'results' Get paginated + filtered results
    // 'total' number of documents matching the filters (ignores pagination)
    const [results, total] = await modifiedQuery.getManyAndCount();

    // Calculate the total number of pages based on total records
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      retrieved: results.length,
      page,
      totalPages,
      data: results,
    };
  }
}
