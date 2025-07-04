import { SelectQueryBuilder } from 'typeorm';
import { QueryDto } from '../dto/query.dto';

export class QueryBuilderService {
  constructor(
    private queryBuilder: SelectQueryBuilder<any>,
    private queryParams: QueryDto, // This contains all the incoming query parameters
    private alias: string, // Alias is a temporary name used to refer to the table, like 'user' or 'post'
  ) {}

  filter(): this {
    // Fields we do NOT want to treat as filters
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'search'];

    // Copy query params and remove excluded fields
    const filters = { ...this.queryParams };
    excludedFields.forEach((field) => delete filters[field]);

    // Loop through each filter field
    Object.entries(filters).forEach(([key, value]) => {
      //Skip non-string values (e.g. ?tags[]=node)
      if (typeof value != 'string') return;

      // Check if value contains a comparison operator (e.g. "gte=25")
      const match = value.match(/(gte|gt|lte|lt)=(\d+)/);

      if (match) {
        // `operator` = "gte", and `num` = "25" if value was "gte=25"
        // ',' To skips the first item "gte=25"
        const [, operator, num] = match;
        // Convert operator names to actual SQL syntax
        const opMap = { gte: '>=', gt: '>', lte: '<=', lt: '<' };

        // Add WHERE clause with operator (e.g. user.age >= 25)
        // We want the result to be: ('user.age >= :age', { age: 30 })
        this.queryBuilder.andWhere(
          `${this.alias}.${key} ${opMap[operator]} :${key}`,
          {
            [key]: Number(num),
          },
        );
      } else {
        // If no operator, so basic filter (e.g. user.role = 'admin')
        // We want the result to be: ('user.role = :role', { role: admin })
        this.queryBuilder.andWhere(`${this.alias}.${key} = :${key}`, {
          [key]: value,
        });
      }
    });

    return this; // Allows chaining
  }

  search(columns: string[]): this {
    // Removes any extra spaces before or after the search string
    const search = this.queryParams.search?.trim();

    if (search) {
      // Build a list of ILIKE conditions for each column
      const searchConditions = columns.map((column, index) => {
        // Create a unique parameter name for each column to avoid SQL conflicts
        // Example: search0, search1
        const paramName = `search${index}`;

        // Set the parameter value for the query builder
        // %ahmed% means: match anything that contains 'alex'
        this.queryBuilder.setParameter(paramName, `%${search}%`);

        // Return a condition like: user.name ILIKE :search0
        // ILIKE is case-insensitive search operator
        return `${this.alias}.${column} ILIKE :${paramName}`;
      });

      // Join all conditions with OR to build something like:
      // WHERE (user.name ILIKE '%alex%' OR user.email ILIKE '%alex%')
      this.queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`);
    }

    return this;
  }

  sort(): this {
    const sort = this.queryParams.sort;

    if (sort) {
      // If multiple sort fields are passed, split them into an array
      sort.split(',').forEach((field: string) => {
        // Determine sort direction
        const order = field.startsWith('-') ? 'DESC' : 'ASC';

        // Remove the '-' if present to get the actual field name
        const fieldName = field.replace('-', '');

        // Result: user.createdAt DESC
        this.queryBuilder.addOrderBy(`${this.alias}.${fieldName}`, order);
      });
    }

    return this;
  }

  limitFields(): this {
    const fields = this.queryParams.fields;

    if (fields) {
      const selectedFields = fields
        .split(',')
        .map((field: string) => `${this.alias}.${field.trim()}`);

      this.queryBuilder.select(selectedFields);
    }

    return this;
  }

  paginate(): this {
    const skip = (this.queryParams.page! - 1) * this.queryParams.limit!;

    this.queryBuilder.skip(skip).take(this.queryParams.limit);
    return this;
  }

  /**
   * Returns the modified query builder so it can be executed.
   */
  getQuery(): SelectQueryBuilder<any> {
    return this.queryBuilder;
  }
}
