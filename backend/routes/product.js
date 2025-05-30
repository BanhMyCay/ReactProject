/**
 * @title     Product Router
 * @brief     Task of Product route for products collection
 * @filename  product.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      29/05/2025
 */

/** -------------------------------------------------------------------------- 
  @NOTE ----------------------------------------------------------------------
--------------------------------------------------------------------------- */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Express modules API */
const express = require("express"); // component liên kết với return của express module

/** Models define */
const {           // mảng chứa các hàm thao tác với products collection trên database
  getProducts,    // lấy tất cả documents
  getProduct,     // lấy 1 document
  createProduct,  // tạo 1 document
  deleteProduct,  // xóa 1 document
  updateProduct,  // sửa 1 document
} = require("../controllers/productController");



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Component router app, khởi tạo một "mini-app" chuyên xử lý các route liên quan đến một phần của ứng dụng */
const router = express.Router();

/** Route xử lý các request get tất cả document
 * @Arg1  '/' - URL tạo req
 * @Arg2  hàm xử lý req (lấy tất cả documents)
 */
router.get("/", getProducts);

/** Route xử lý các request get 1 document cụ thể (theo ID)
 * @Arg1  '/:id' - URL tạo req, ':id' là tham số động từ URL, có thể truy cập qua req.params.id
 * @Arg2  hàm xử lý req (lấy tất 1 document theo id)
 */
router.get("/:id", getProduct);

/** Route xử lý các request post 1 document
 * @Arg1  '/' - URL tạo req
 * @Arg2  hàm xử lý req (tạo 1 document)
 */
router.post("/", createProduct);

/** Route xử lý các request delete 1 document cụ thể (theo ID)
 * @Arg1  '/:id' - URL tạo req, ':id' là tham số động từ URL, có thể truy cập qua req.params.id
 * @Arg2  hàm xử lý req (xóa 1 document)
 */
router.delete("/:id", deleteProduct);

/** Route xử lý các request patch - sửa 1 document cụ thể (theo ID)
 * Route sửa một product cụ thể (theo ID)
 * @Arg1  '/:id' - URL tạo req, ':id' là tham số động từ URL, có thể truy cập qua req.params.id
 * @Arg2  hàm xử lý req (sửa 1 document)
 */
router.patch("/:id", updateProduct);



/** Export module */
module.exports = router;
