import AWS from "aws-sdk"
const db = new AWS.DynamoDB.DocumentClient()
const TableName = process.env.TABLE_NAME

export const create = async event => {

    const categoryData = JSON.parse(event.body);
    console.log("the emp data is: " + categoryData);

    if (categoryData.wannaDelete) {
        const params = {
            TableName: TableName,
            Key: {
                PK: categoryData.companyId,
                SK: "CATEGORY#"+categoryData.categoryName,
            }
        };
        const result = await db
            .delete(params)
            .promise()
        return { statusCode: 200, body: JSON.stringify("Deleted successfully") }
    }
    if (categoryData.wannaGet) {

        const params = {
            TableName: TableName,
            KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
            ExpressionAttributeValues: {
                ':pk': categoryData.companyId,
                ':sk': "CATEGORY#"+categoryData.categoryName,
            }
        };
        const data = await db
            .query(params)
            .promise()
        return { statusCode: 200, body: JSON.stringify(data) }
    }

    const newCategory = {
        PK: categoryData.companyId,
        SK: "CATEGORY#"+categoryData.categoryName,
        id:categoryData.id,
        categoryAdmin:categoryData.categoryAdmin,
        secondaryCategoryAdmin:categoryData.secondaryCategoryAdmin,
        tertiaryCategoryAdmin:categoryData.tertiaryCategoryAdmin,
        categoryItems:categoryData.categoryItems,
        categoryName:categoryData.categoryName,
        checked:categoryData.checked,
        createdDate:categoryData.createdDate,
        defaultItems:categoryData.defaultItems,
        isDefaultItemsSelect:categoryData.isDefaultItemsSelect,
        createdBy:categoryData.createdBy,
        isDeleted:categoryData.isDeleted,
        selectedAdmins:categoryData.selectedAdmins

    }
    await db
        .put({
            TableName,
            Item: newCategory,
        })
        .promise()

    return { statusCode: 200, body: JSON.stringify(`category created successfully`) }
}