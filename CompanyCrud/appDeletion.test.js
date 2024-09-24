import { deletion } from './app.mjs';
import AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const deleteMock = jest.fn();
  const DocumentClientMock = {
    delete: deleteMock,
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => DocumentClientMock),
    },
  };
});

describe('Testing deletion function', () => {
  let deleteMock;
  let db;

  beforeEach(() => {
    db = new AWS.DynamoDB.DocumentClient();
    deleteMock = db.delete;
  });

  it('should delete the company and return the expected response', async () => {
    // Mock the delete method to resolve successfully
    deleteMock.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    // Define the body data
    const body = JSON.stringify({
      wannaDelete: true,
      companyId: '1234',
    });

    // Call the function
    const result = await deletion(body);

    // Assert that delete was called with the correct parameters
    expect(deleteMock).toHaveBeenCalledWith({
      TableName: 'testTable',
      Key: {
        PK: 'COMPANY',
        SK: '1234',
      },
    });

    // Assert the return value
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify('Deleted successfully'),
    });
  });
});
