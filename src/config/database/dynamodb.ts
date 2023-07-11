import * as maintenanceModeMessage from 'aws-sdk/lib/maintenance_mode_message';
maintenanceModeMessage.suppress = true;
import * as AWS from 'aws-sdk';
import { CustomErrorException } from '../../shared/exceptions/custom-error.exception';
import { ERRORS } from '../../shared/constants';
import { Logger } from '@nestjs/common';

export interface DynamoDBItem {
  [key: string]: any;
}

export type IScan = Omit<AWS.DynamoDB.DocumentClient.ScanInput, 'TableName'>;
export type IQuery = Omit<AWS.DynamoDB.DocumentClient.QueryInput, 'TableName'>;

const client: AWS.DynamoDB.DocumentClient | null = null;

export abstract class AWSDynamo<T extends DynamoDBItem> {
  private readonly tableName: string;
  private readonly docClient: AWS.DynamoDB.DocumentClient;

  protected constructor(tableName: string) {
    this.tableName = tableName;

    const options: AWS.DynamoDB.DocumentClient.DocumentClientOptions &
      AWS.DynamoDB.Types.ClientConfiguration = {
      maxRetries: 10,
    };

    // Check and set configuration for DynamoDB local
    if (process.env.STAGE) {
      options.region = 'local';
      options.endpoint = 'http://localhost:8000';
    }
    // This is pattern to make sure client is just created one time when we connect with DynamoDB
    if (client) {
      this.docClient = client;
    } else {
      this.docClient = new AWS.DynamoDB.DocumentClient(options);
    }
  }

  /**
   * Logging errors related DB
   *
   * @param error
   * @private
   */
  private logDBError(error) {
    Logger.error(`DB Error: ${JSON.stringify(error)}`);
  }

  /**
   * Create a new record
   *
   * @param item
   */
  async create(item: T) {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: this.tableName,
      Item: item,
    };
    try {
      await this.docClient.put(params).promise();
    } catch (err: any) {
      this.logDBError(err);
      throw new CustomErrorException(ERRORS.DBInsert);
    }
  }

  /**
   * Updated a record
   *
   * @param key
   * @param updates
   */
  async update(key: Record<any, any>, updates: Partial<T>) {
    const UpdateExpression =
      `SET ` +
      Object.keys(updates)
        .map((key) => `#${key}=:${key}`)
        .join(', ');

    const ExpressionAttributeNames = Object.keys(updates).reduce(
      (acc, key) => ({
        ...acc,
        [`#${key}`]: key,
      }),
      {},
    );

    const ExpressionAttributeValues = Object.keys(updates).reduce(
      (acc, key) => ({
        ...acc,
        [`:${key}`]: updates[key],
      }),
      {},
    );

    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: this.tableName,
      Key: key,
      UpdateExpression,
      ExpressionAttributeNames,
      ExpressionAttributeValues,
    };

    try {
      await this.docClient.update(params).promise();
    } catch (err: any) {
      this.logDBError(err);
      throw new CustomErrorException(ERRORS.DBUpdate);
    }
  }

  /**
   * Delete a record
   *
   * @param key
   */
  async delete(key: Record<any, any>) {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: this.tableName,
      Key: key,
    };
    try {
      await this.docClient.delete(params).promise();
    } catch (err: any) {
      this.logDBError(err);
      throw new CustomErrorException(ERRORS.DBDelete);
    }
  }

  /**
   * Scan the record in the database
   *
   * @param params
   */
  async scan(params: IScan) {
    const sendParams: AWS.DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
      ...params,
    };
    try {
      const result = await this.docClient.scan(sendParams).promise();
      return {
        Items: result.Items as T[],
        Count: result.Count,
        LastEvaluatedKey: result.LastEvaluatedKey,
      };
    } catch (err: any) {
      this.logDBError(err);
      throw new CustomErrorException(ERRORS.DBQuery);
    }
  }

  /**
   * Query record in the database
   *
   * @param params
   */
  async query(params: IQuery) {
    const sendParams: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: this.tableName,
      ...params,
    };
    try {
      const result = await this.docClient.query(sendParams).promise();
      return {
        Items: result.Items as T[],
        Count: result.Count,
        LastEvaluatedKey: result.LastEvaluatedKey,
      };
    } catch (err: any) {
      this.logDBError(err);
      throw new CustomErrorException(ERRORS.DBQuery);
    }
  }

  /**
   * Query record in the database
   *
   * @param key
   */
  async get(key: Record<string, any>) {
    const sendParams: AWS.DynamoDB.DocumentClient.Get = {
      TableName: this.tableName,
      Key: key,
    };
    try {
      const result = await this.docClient.get(sendParams).promise();
      return result.Item as T;
    } catch (err: any) {
      this.logDBError(err);
      throw new CustomErrorException(ERRORS.DBQuery);
    }
  }
}
