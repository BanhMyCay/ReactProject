/**
 * @title     Router Products
 * @brief     Handle of actions route to "product" collection
 * @filename  products.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      01/06/2025
 */



/** -------------------------------------------------------------------------- 
  @NOTE ----------------------------------------------------------------------
--------------------------------------------------------------------------- */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Express modules API */
const express = require("express"); // component liên kết với return của express module

/** Controller for database */
const { 
  getProducts,    // lấy tất cả documents
  getProduct,     // lấy 1 document
  createProduct,  // tạo 1 document
  deleteProduct,  // xóa 1 document
  updateProduct,  // sửa 1 document
} = require("../controllers/productController");  // các ham xử lý với "products" collection



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Component router app, khởi tạo một "mini-app" với các router chuyên xử lý các requests đến "products" collection */
const router = express.Router();

/** Route xử lý các request get (lấy tất cả documents)
 * @Arg1  "/" - URL tạo req
 * @Arg2  hàm xử lý request
 */
router.get("/", getProducts);

/** Route xử lý các request get (lấy 1 document theo ID)
 * @Arg1  "/:id" - là tham số động từ URL, có thể truy cập qua "req.params.id"
 * @Arg2  hàm xử lý request
 */
router.get("/:id", getProduct);

/** Route xử lý các request post (tạo 1 document)
 * @Arg1  "/" - URL tạo req
 * @Arg2  hàm xử lý request
 */
router.post("/", createProduct);

/** Route xử lý các request delete (xóa 1 document theo ID)
 * @Arg1  "/:id" - là tham số động từ URL, có thể truy cập qua "req.params.id"
 * @Arg2  hàm xử lý request
 */
router.delete("/:id", deleteProduct);

/** Route xử lý các request patch (sửa 1 document theo ID)
 * @Arg1  "/:id" - là tham số động từ URL, có thể truy cập qua "req.params.id"
 * @Arg2  hàm xử lý request
 */
router.patch("/:id", updateProduct);



/** Export module */
module.exports = router;
