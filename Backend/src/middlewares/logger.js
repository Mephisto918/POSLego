// 
async function loggers(req, res, next) {
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'];
    const timeStamp = new Date().toISOString();

    const width = process.stdout.columns;
    // console.log(Array(width).fill('*').join(''));
    // console.log(`method - ${method}`);
    // console.log(`url - ${url}`);
    console.log(`userAgent - ${userAgent}`);
    // console.log(`time - ${timeStamp}`);
    console.log(Array(width).fill('*').join(''));

    next();
}

export { loggers };