/**
 * @title     Server setup file
 * @brief     File setup Server for frontend and backend
 * @filename  server.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      02/06/2025
 */



/** -------------------------------------------------------------------------- 
  @NOTE ----------------------------------------------------------------------
--------------------------------------------------------------------------- */
// npm install express (thư viện express, framework web hỗ trợ xây dựng API giao tiếp giữa browser và database)
// npm install -g nodemon (package để thực hiện update server khi thay đổi file code - cho dev - chỉ tải 1 lần)
// npm install dotenv (package dotenv, sử dụng file .env)
// nodemon server.js (bắt đầu chạy server)
// npm install mongoose (mongoose là một thư viện (ODM) dùng trong Node.js để làm việc với MongoDB)
// npm install axios (thư viện HTTP client giúp gửi request và nhận response từ một server)
// npm install cors (CORS middleware (cho phép clients từ domain khác, VD: localhost:3000))


/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Backend API modules */
const express = require("express"); // Express module API (khởi tạo web server)
const cors = require("cors");       // CORS middleware (cho phép clients từ domain khác, VD: localhost:3000)
const axios = require("axios");     // Axios modules, HTTP client, giúp gửi các request (GET, POST, PUT, DELETE,...) đến server khác.

/** Database API */
const mongoose = require("mongoose"); // Tập thư viện dùng để kết nối và làm việc với MongoDB

/** Router component (mini-app) */
const productRoutes = require("./routes/products");  // component router chuyên xử lý requests đến product collection (database)

/** Extra file */
require("dotenv").config(); // file .env chứa các biến môi trường (process.env)



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Express app component, khởi tạo ứng dụng Express */
const exapp = express();



/** -------------------------------------------------------------------------- 
  @MIDDLEWARE_FUNCTIONS ------------------------------------------------------
--------------------------------------------------------------------------- */
/** Middleware - là các hàm chạy trước khi request được xử lý bởi route chính */

/** Tự động phân tích (parse) body của request nếu nội dung là JSON
 *  Nếu không có dòng này, req.body sẽ là undefined
 */
exapp.use(express.json());

/** Cho phép API được gọi từ domain khác */
exapp.use(cors());

/** Tự động tiền xử lý các request trước khi xử lý trong app
 * @Arg1  req   - request từ route
 * @Arg2  res   - respone lên route
 * @Arg3  next  - Gọi router xử lý request
 */
exapp.use((req, res, next) => {
  console.log(req.path, req.method);  // log lại thông tin request
  next();
});



/** -------------------------------------------------------------------------- 
  @FUNCTIONS -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Gắn router "productRoutes vào" địa chỉ "/api/products"
 *  Bất kỳ request nào bắt đầu bằng "/api/products" sẽ được xử lý bởi các router định nghĩa trong "./routes/product"
 * @Arg1  "/api/products" - đường dẫn gốc của products modules
 * @Arg2  "mini-app" routers xử lý các request
 */
exapp.use("/api/products", productRoutes);

/** Hàm reset toàn bộ dữ liệu trên MongoDB và thêm lại 10 products từ "dataSource" 
 *  "async/await" để xử lý các hàm bất đồng bộ
 * @Arg1  dataSource - URL chứa sản phẩm
*/
async function init_mongoDb() {
  try {
    /** Gửi request get đến "SOURCE_DATABASE_URL" để lấy danh sách products
     *  Chuyển định dạng về dữ liệu JSON "response.json()"
     * @Ret1  response    - tạm chứa dữ liệu phản hồi từ URL 
     * @Ret2  dataSource  - object chứa toàn bộ dữ liệu sản phẩm
    */
    const response = await fetch(process.env.SOURCE_DATABASE_URL);
    const dataSource = await response.json();

    if (!dataSource && !dataSource.products) {  // Nếu không lấy được dữ liệu sản phẩm, log lỗi.
      console.log("Cannot get source database");
      return false;
    }

    /** log lại dữ liệu sản phẩm */
    //console.log(dataSource);        
    console.log("Get source data ok");

    /** Hàm tạo request get đến địa chỉ "/api/products"
     *  Lấy tất cả document của "products" collection trong MongoDB
     * @Arg1  Link dẫn địa chỉ "/api/products"
     * @Ret1  result - tạm chứa tất cả documents từ database
     */
    const result = await axios.get(
      "http://localhost:" + process.env.PORT + "/api/products/"
    );

    console.log(result.data);

    /** Vòng for xóa từng documents của "products" collection */
    for (let i = 0; i < result.data.length; i++) {
      /** Hàm tạo request delete đến địa chỉ "/api/products"
       *  Lấy tất cả document của "products" collection trong MongoDB
       * @Arg1  Link dẫn địa chỉ "/api/products"
       */
      await axios.delete(
        "http://localhost:" +
        process.env.PORT +
        "/api/products/" +
        result.data[i].id
      );
    }

    /** Vòng for tạo 10 documents mới cho "products" collection */
    for (let i = 0; i < process.env.DATABASE_LENGTH; i++) {
      const data = dataSource.products[i];  // component object chứa thông tin từng sản phẩm
      
      /** Hàm tạo request post đến địa chỉ "/api/products"
       *  Tạo document mới lên "products" collection trong MongoDB
       * @Arg1  Link dẫn địa chỉ "/api/products"
       * @Arg2  Object chứa thông document
       */
      const result = await axios.post(
        "http://localhost:" + process.env.PORT + "/api/products/",
        {
          id:         data.id,        // id sản phẩm
          name:       data.title,     // tiêu đề sản phẩm
          details:    data.description,// mô tả sản phẩm
          category:   data.category,  // phân loại hàng hóa
          price:      data.price,     // giá sản phẩm
          image:      data.images,    // ảnh sản phẩm
          createdBy: {
            displayName:  "BanhMyCay",
            id: "tcDWSJANQCbIhzimB03RMJbUI9h1",
            photoURL: null
          },
          comments:   [{
            content:    "rất tốt",
            displayName: "BanhMyCay",
            id:   0.8658588228800707,
            photoURL: null,       
          },
          {
            content:    "đồ xịn",
            displayName: "BanhMyCay",
            id:   0.8658523228800707,
            photoURL: null,       
          }]
        }
      );
    }

    return true;
  } catch (err) {  // Bắt lỗi nếu có lỗi khi khởi tạo database
    console.log(err);// log lỗi
    return false;
  }
}

/** Gọi hàm liên kết với db của mongoDB
 * @Arg1  'process.env.MONGO_URI' - biến môi trường chứa địa chỉ URI kết nối đến MongoDB
 */
mongoose.connect(process.env.MONGO_URI)
  .then(async () => { // hàm xử lý sau khi kết nối thành công
    console.log('connected to database')

    /** Khởi động server, lắng nghe các request trên cổng được chỉ định
     * @Arg1  công chỉ định (lấy từ biến môi trường "PORT")
     * @Arg2  hàm xử lý sau khi khởi động
     */
    exapp.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })

    /** Hàm init toàn bộ dữ liệu trên MongoDB và thêm lại 10 products từ "dataSource" 
     *  "async/await" để xử lý các hàm bất đồng bộ
     * @Arg1  initDatabase - trạng thái hàm 
     */
    // const initDatabase = await init_mongoDb();
    // if (initDatabase) { // init dữ liệu trên MongoDB thành công, log trạng thái
    //   console.log("Init database OK!");
    // } else {   // init dữ liệu trên MongoDB thất bại, log trạng thái
    //   console.log("Failed to init database");
    // }
  })
  .catch((err) => {   // hàm xử lý khi kết nối có lỗi xảy ra
    console.log(err)  // log lỗi
  }) 


