export const dbSettings = {
    PORT: process.env.PORT || 5005,
    MONGO_URL:  process.env.MONGO_URL || 'mongodb://localhost:27018',
    DB_NAME: process.env.DB_NAME || 'dbIncubator'
}