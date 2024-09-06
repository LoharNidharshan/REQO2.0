import AWS from "aws-sdk"
const db = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

export const create = async event => {
  const empData = JSON.parse(event.body);
  console.log("the emp data is: " + empData.name);

  if (empData.wannaDelete) {
    const params = {
      TableName: TableName,
      Key: {
        PK: empData.companyId, // Partition key
        SK: "USERS#"+empData.emailId            // Sort key
      }
    };
    const result = await db
      .delete(params)
      .promise()
    return { statusCode: 200, body: JSON.stringify("Deleted successfully") }
  }
  if (empData.wannaGet) {
    // const params = {
    //   TableName: TableName, 
    //   Key: {
    //     PK: "COMPANY#" + empData.companyId, // Partition key
    //     SK: "USERS#" + empData.empId            // Sort key
    //   }
    // };
    // Define the parameters for the DynamoDB query operation
    const params = {
      TableName: TableName, // Ensure this matches your environment variable
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': empData.companyId, // Partition key,   // Exact match for PartitionKey
        ':sk': "USERS#"+empData.emailId            // Sort key         // Begins with for SortKey
      }
    };
    const data = await db
      .query(params)
      .promise()
    return { statusCode: 200, body: JSON.stringify(data) }
  }

  const newUser = {
    PK: empData.companyId,
    SK: "USERS#"+empData.emailId,
    emailId: empData.emailId,
    doj: empData.doj,
    empAdd: empData.empAdd,
    empContact: empData.empContact,
    empId: empData.empId,
    empName: empData.empName,
    empRole: empData.empRole,
    isActive: empData.isActive,
    isDeleted: empData.isDeleted,
    responderId: empData.responderId,
    roleChange: empData.roleChange,
    companyId: empData.companyId,
    requestApproved: empData.requestApproved
  }
  await db
    .put({
      TableName,
      Item: newUser,
    })
    .promise()

  return { statusCode: 200, body: JSON.stringify(`user created successfully`) }

}
