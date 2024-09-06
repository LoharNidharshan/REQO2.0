import AWS from "aws-sdk"
const db = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

export const create = async event => {

    const itemData = JSON.parse(event.body);
    console.log("the emp data is: " + itemData);

    if (itemData.wannaDelete) {
        const params = {
            TableName: TableName,
            Key: {
                PK: itemData.companyId,
                SK: "ITEMS#" + itemData.creatorMailId + "#" + itemData.categoryName,
            }
        };
        const result = await db
            .delete(params)
            .promise()
        return { statusCode: 200, body: JSON.stringify("Deleted successfully") }
    }
    if (itemData.wannaGet) {

        const params = {
            TableName: TableName,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': itemData.companyId,
                ':sk': "ITEMS#" + itemData.creatorMailId + "#" + itemData.categoryName,
            }
        };
        const data = await db
            .query(params)
            .promise()
        return { statusCode: 200, body: JSON.stringify(data) }
    }

    const newItem = {
        PK: itemData.companyId,
        SK: "ITEMS#" + itemData.creatorMailId + "#" + itemData.categoryName,
        creatorMailId: itemData.creatorMailId,
        ticketNo: itemData.ticketNo,
        assetId: itemData.assetId,
        categoryName: itemData.categoryName,
        categoryAdmin: itemData.categoryAdmin,
        comments: itemData.comments,
        companyId: itemData.companyId,
        description: itemData.description,
        history: itemData.history,
        imageKey: itemData.imageKey,
        isDeleted: itemData.isDeleted,
        request: itemData.request,
        requestToAll: itemData.requestToAll,
        requestCreatedTime: itemData.requestCreatedTime,
        requester: itemData.requester,
        requestTitle: itemData.requestTitle,
        requestTo: itemData.requestTo,
        status: itemData.status,
        track: itemData.track

    }
    await db
        .put({
            TableName,
            Item: newItem,
        })
        .promise()

    return { statusCode: 200, body: JSON.stringify(`item created successfully`) }
}