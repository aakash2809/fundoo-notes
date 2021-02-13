
require(`dotenv`).config();

module.exports = {
        NODE_ENV: process.env.NODE_ENV ,
        PORT: process.env.PORT ,
        MONGODB_URL:process.env.MONGODB_URL,
        SECRET_KEY:process.env.SECRET_KEY,
        CLIENT_URL:process.env.CLIENT_URL,
        EMAIL_USER:process.env.EMAIL_USER,
        EMAIL_PASS:process.env.EMAIL_PASS,
}