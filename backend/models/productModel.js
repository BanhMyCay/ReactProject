/**
 * @title     products collection define
 * @brief     Define structure for products collection on Database
 * @filename  productModels.js
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
/** Component mongoose */
const mongoose = require("mongoose")  // component liên kết với tập thư viện dùng để kết nối và làm việc với MongoDB



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Constructor là một hàm đặc biệt được sử dụng để tạo và khởi tạo đối tượng (object) khi sử dụng từ khóa new */
/** Component gắn với constructor Schema từ mongoose, dùng để định nghĩa cấu trúc dữ liệu cho các documents trong MongoDB */
const Schema = mongoose.Schema;

/** Định nghĩa cấu trúc dữ liệu chính cho product
 * @Arg1  Trường dữ liệu tự tạo
 *        @id           - ID của product (kiểu số, bắt buộc)
 *        @title        - tên product (kiểu chuỗi, bắt buộc)
 *        @description  - mô tả product (kiểu chuỗi, bắt buộc)
 *        @category     - phân loại product (kiểu chuỗi, bắt buộc)
 *        @price        - giá tiền (kiểu số, bắt buộc)
 *        @rating       - đánh giá (kiểu số, bắt buộc)
 *        @stock        - số lượng kho (kiểu số, bắt buộc)
 *        @tags         - tags theo product 
 *        @image        - mảng link source hình ảnh (không bắt buộc)
 * @Arg2  '_id: false'  - tắt tính năng tự động tạo id
 */
const productSchema = new Schema({
  id: {
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
  photoURL: { 
    type: String, 
    default: null 
  }
})



/** Tạo model có tên là 'Product'. Mongoose sẽ tự map model 'productSchema' này sang collection products (dạng số nhiều, chữ thường).
 *  'module.exports' cho phép import model này ở file khác bằng require('./models/Product')
 */
module.exports = mongoose.model("Product", productSchema)
