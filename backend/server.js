/**
 * @title     Server setup file
 * @brief     File setup Server for frontend and backend
 * @filename  server.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      28/05/2025
 */



/** -------------------------------------------------------------------------- 
  @NOTE ----------------------------------------------------------------------
--------------------------------------------------------------------------- */
// npm install express (thư viện express, framework web hỗ trợ xây dựng API giao tiếp giữa browser và database)
// npm install -g nodemon (package để thực hiện update server khi thay đổi file code - cho dev - chỉ tải 1 lần)
// npm install dotenv (package dotenv, sử dụng file .env)
// nodemon server.js (bắt đầu chạy server)
// npm install mongoose (mongoose là một thư viện (ODM) dùng trong Node.js để làm việc với MongoDB)
// npm install axios (axios )



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Express modules API */
const express = require('express')                    // component liên kết với return của express module

/** Component router app */
const workoutRoutes = require('./routes/workouts')    // "mini-app" chuyên xử lý các route liên quan đến một phần của ứng dụng

/** Component mongoose */
const mongoose = require('mongoose')                  // component liên kết với tập thư viện dùng để kết nối và làm việc với MongoDB

/** Dotenv modules */
require('dotenv').config()                            // tự động tải các biến môi trường từ một file .env vào process.env



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Express app component, khởi tạo ứng dụng Express */
const exapp = express()



/** -------------------------------------------------------------------------- 
  @MIDDLEWARE_FUNCTIONS ------------------------------------------------------
--------------------------------------------------------------------------- */
/** Middleware - là các hàm chạy trước khi request được xử lý bởi route chính */

/** Tự động phân tích (parse) body của request nếu nội dung là JSON
 *  Nếu không có dòng này, req.body sẽ là undefined
 */
exapp.use(express.json())

/** Tự động tiền xử lý các request trước khi xử lý trong app
 * @Arg1  req   - request từ route
 * @Arg2  res   - respone lên route
 * @Arg3  next  - Gọi route tiếp theo
 */
exapp.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})



/** -------------------------------------------------------------------------- 
  @FUNCTIONS -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Route xử lý các request đến địa chỉ '/api/products'
 * @Arg1  '/api/products' - đường dẫn gốc của products
 * @Arg2  "mini-app" chuyên xử lý các route
 */
exapp.use('/api/workouts', workoutRoutes)

/** Gọi hàm liên kết với db của mongoDB
 * @Arg1  'process.env.MONGO_URI' - biến môi trường chứa địa chỉ URI kết nối đến MongoDB
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {       // hàm xử lý sau khi kết nối thành công
    console.log('connected to database')

    /** Khởi động server, lắng nghe các request trên cổng được chỉ định
     * @Arg1  công chỉ định (lấy từ biến môi trường 'PORT')
     * @Arg2  hàm xử lý sau khi khởi động
     */
      exapp.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {   // hàm xử lý khi kết nối có lỗi xảy ra
    console.log(err)  // log lỗi
  }) 


