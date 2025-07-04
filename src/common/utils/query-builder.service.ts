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
        this.queryBuilder.andWhere(
          `${this.alias}.${key} ${opMap[operator]} :${key}`,
          {
            [key]: Number(num),
          },
        );
      } else {
        // If no operator, so basic filter (e.g. user.role = 'admin')
        this.queryBuilder.andWhere(`${this.alias}.${key} = :${key}`, {
          [key]: value,
        });
      }
    });

    return this; // Allows chaining
  }
}
