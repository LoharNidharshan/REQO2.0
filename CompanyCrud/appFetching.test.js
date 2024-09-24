import { fetching } from './app.mjs'; // Replace './yourFile' with the actual file path where the fetching function is located
import AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const queryMock = jest.fn();
  const DocumentClientMock = {
    query: queryMock,
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => DocumentClientMock),
    },
  };
});

describe('Testing fetching function', () => {
  let queryMock;
  let db;

  beforeEach(() => {
    db = new AWS.DynamoDB.DocumentClient();
    queryMock = db.query;
  });

  it('should fetch the company data and return the expected response', async () => {
    // Mock the query method to resolve successfully with sample data
    const mockData = {
      Items: [
        { companyId: '1234', companyName: 'Test Company', companySector: 'Tech' },
      ],
    };
    queryMock.mockReturnValue({
      promise: jest.fn().mockResolvedValue(mockData),
    });

    // Define the body data
    const body = JSON.stringify({
      wannaGet: true,
      companyId: '1234',
    });

    // Call the function
    const result = await fetching(body);

    // Assert that query was called with the correct parameters
    expect(queryMock).toHaveBeenCalledWith({
      TableName: 'testTable',
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': 'COMPANY',
        ':sk': '1234',
      },
    });

    // Assert the return value
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify(mockData),
    });
  });
});
