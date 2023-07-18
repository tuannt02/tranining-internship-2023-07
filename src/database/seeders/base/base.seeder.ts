import { AWSDynamo, DynamoDBItem } from '../../../config/database/dynamodb';

export class BaseSeeder<T extends DynamoDBItem> {
  private readonly model: AWSDynamo<T>;

  protected constructor(model: AWSDynamo<T>) {
    this.model = model;
  }

  /**
   * Create new record to be stored in the database
   *
   * @param items
   */
  async seed(items: T[]) {
    console.log(`Seeding: ${this.model['tableName']}`);
    return items.map((item) => this.model.create(item));
  }
}
