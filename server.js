require('dotenv').config()

const mongoose = require("mongoose")
const express = require("express")
const morgan = require("morgan")
const ApiError = require("./utils/ApiError")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const { DBConnection } = require('./configs/DB')
const port = process.env.PORT || 5000
const app = express()
DBConnection()
// Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan("dev"))
    console.log(`mode : ${process.env.NODE_ENV}`)
}
app.use(express.json())
app.use(express.urlencoded())

// Mount Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.all("*", (req, res, next) => {
    next(new ApiError(`cant't find this route ${req.originalUrl}`),404)
})
//Global Error Handling Middleware For Express
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'Error'
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
    })
    next()

})


app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})