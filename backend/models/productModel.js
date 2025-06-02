/**
 * @title     Products collection define
 * @brief     Define structure for "products" collection on Database
 * @filename  productModels.js
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
/** Database API */
const mongoose = require("mongoose"); // Tập thư viện dùng để kết nối và làm việc với MongoDB



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Constructor là một hàm đặc biệt được sử dụng để tạo và khởi tạo đối tượng (object) khi sử dụng từ khóa new */
/** Component gắn với constructor Schema từ mongoose, dùng để định nghĩa cấu trúc dữ liệu cho các documents trong MongoDB */
const Schema = mongoose.Schema;

/** Định nghĩa cấu trúc dữ liệu chính cho product
 * @Arg1  Trường dữ liệu tự tạo
 *        @productId  - ID của product (kiểu số, bắt buộc)
 *        @title      - tên product (kiểu chuỗi, bắt buộc)
 *        @category   - phân loại product (kiểu chuỗi, bắt buộc)
 *        @price      - giá tiền (kiểu số, bắt buộc)
 *        @image      - mảng link source hình ảnh (không bắt buộc)
 */
const productSchema = new Schema({
  productId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: Array,
    default: [],
  },
});



/** Tạo model có tên là 'Product'. Mongoose sẽ tự map model 'productSchema' này sang collection products (dạng số nhiều, chữ thường).
 *  'module.exports' cho phép import model này ở file khác bằng require('./models/Product')
 */
module.exports = mongoose.model("Product", productSchema);
