import { inserting } from './app'; // Replace './yourFile' with the actual file path where the inserting function is located
import AWS from 'aws-sdk';

jest.mock('aws-sdk', () => {
  const putMock = jest.fn();
  const DocumentClientMock = {
    put: putMock,
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => DocumentClientMock),
    },
  };
});

describe('Testing inserting function', () => {
  let putMock;
  let db;

  beforeEach(() => {
    db = new AWS.DynamoDB.DocumentClient();
    putMock = db.put;
  });

  it('should insert the company data and return the expected response', async () => {
    // Mock the put method to resolve successfully
    putMock.mockReturnValue({
      promise: jest.fn().mockResolvedValue({}),
    });

    // Define the body data
    const body = JSON.stringify({
      companyId: '1234',
      actualEmployeeCount: 100,
      companyOrigin: 'USA',
      companySector: 'Tech',
      companySize: 'Large',
      customerId: 'cust123',
      description: 'A tech company',
      invoiceId: 'inv123',
      isDeleted: false,
      paidEmployeeCount: 90,
      subscriptionEnded: false,
      subscriptionId: 'sub123',
      subscriptionStartDate: '2023-01-01',
      subscriptionStatus: 'active',
      subscriptionType: 'premium',
      companyName: 'TechCorp',
    });

    // Call the function
    const result = await inserting(body);

    // Assert that put was called with the correct parameters
    expect(putMock).toHaveBeenCalledWith({
      TableName: 'testTable',
      Item: {
        PK: 'COMPANY',
        SK: '1234',
        actualEmployeeCount: 100,
        companyOrigin: 'USA',
        companySector: 'Tech',
        companySize: 'Large',
        customerId: 'cust123',
        description: 'A tech company',
        invoiceId: 'inv123',
        isDeleted: false,
        paidEmployeeCount: 90,
        subscriptionEnded: false,
        subscriptionId: 'sub123',
        subscriptionStartDate: '2023-01-01',
        subscriptionStatus: 'active',
        subscriptionType: 'premium',
        companyName: 'TechCorp',
        companyId: '1234',
      },
    });

    // Assert the return value
    expect(result).toEqual({
      statusCode: 200,
      body: JSON.stringify('company created successfully'),
    });
  });
});
