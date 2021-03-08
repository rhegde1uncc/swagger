exports.handler = async (event) => {

    let keyword;
    
    if (event.queryStringParameters && event.queryStringParameters.keyword) {
       keyword = event.queryStringParameters.keyword;
    }
    
    let msg = `RAMYA HEGDE says: ${keyword}`;
    
    const response = {
        statusCode: 200,
        body: msg,
    };
    return response;
};