import AWS from "aws-sdk"
const db = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME
// const TableName = 'testTable'

export const create = async event => {

    const empData = JSON.parse(event.body);
    // console.log("the emp data is: " + empData.name);

    if(empData.wannaDelete) return deletion(event.body);

    else if(empData.wannaGet) return fetching(event.body);

    else return inserting(event.body);
}

export async function inserting(body){
    const empData = JSON.parse(body);

    const newCompany = {
        PK: "COMPANY",
        SK: empData.companyId,
        actualEmployeeCount: empData.actualEmployeeCount,
        companyOrigin: empData.companyOrigin,
        companySector: empData.companySector,
        companySize: empData.companySize,
        customerId: empData.customerId,
        description: empData.description,
        invoiceId: empData.invoiceId,
        isDeleted: empData.isDeleted,
        paidEmployeeCount: empData.paidEmployeeCount,
        subscriptionEnded: empData.subscriptionEnded,
        subscriptionId: empData.subscriptionId,
        subscriptionStartDate: empData.subscriptionStartDate,
        subscriptionStatus: empData.subscriptionStatus,
        subscriptionType: empData.subscriptionType,
        companyName: empData.companyName,
        companyId: empData.companyId
    }
    await db
        .put({
            TableName,
            Item: newCompany,
        })
        .promise()

    return { statusCode: 200, body: JSON.stringify(`company created successfully`) }
}

export async function deletion(body){
    const empData = JSON.parse(body);
    if (empData.wannaDelete) {
        const params = {
            TableName: TableName,
            Key: {
                PK: "COMPANY", // Partition key
                SK: empData.companyId            // Sort key
            }
        };
        const result = await db
            .delete(params)
            .promise()
        return { statusCode: 200, body: JSON.stringify("Deleted successfully") }
    }
}

export async function fetching(body){
    const empData = JSON.parse(body);
    if (empData.wannaGet) {

        const params = {
            TableName: TableName,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': "COMPANY",
                ':sk': empData.companyId
            }
        };
        const data = await db
            .query(params)
            .promise()
        return { statusCode: 200, body: JSON.stringify(data) }
    }
}