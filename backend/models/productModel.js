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

/** Định nghĩa cấu trúc dữ liệu người tạo product
 * @Arg1  Trường dữ liệu tự tạo
 *        @displayName  - tên người tạo (kiểu chuỗi, bắt buộc)
 *        @id           - id người tạo (kiểu chuỗi, bắt buộc)
 *        @photoURL     - link ảnh avatar (kiểu chuỗi, bắt buộc)
 *        @price      - giá tiền (kiểu số, bắt buộc)
 *        @image      - mảng link source hình ảnh (không bắt buộc)
 * @Arg2  "_id: false" - không tạo id phụ 
 */
const createdBySchema = new Schema({
  displayName:  { type: String, required: true },
  id:           { type: String, required: true },
  photoURL:     { type: String, default: null }
}, { _id: false });

/** Định nghĩa cấu trúc dữ liệu mảng chứa tất cả comment
 * @Arg1  Trường dữ liệu tự tạo
 *        @content      - tên người tạo (kiểu chuỗi, bắt buộc)
 *        @createdAt    - ngày tạo (kiểu ngày, bắt buộc)
 *        @displayName  - link ảnh avatar (kiểu chuỗi, bắt buộc)
 *        @id           - giá tiền (kiểu số, bắt buộc)
 *        @photoURL     - mảng link source hình ảnh (không bắt buộc)
 * @Arg2  "_id: false" - không tạo id phụ
 */
const commentSchema = new mongoose.Schema({
  content:      { type: String, required: true },
  createdAt:    { type: Date, default: Date.now },
  displayName:  { type: String, required: true },
  id:           { type: mongoose.Schema.Types.Mixed, required: true },
  photoURL:     { type: String, default: null }
}, { _id: false });

/** Định nghĩa cấu trúc dữ liệu chính cho product
 * @Arg1  Trường dữ liệu tự tạo
 *        @id       - ID của product (kiểu số, bắt buộc, thay thế _id mặc định)
 *        @name     - tên product (kiểu chuỗi, bắt buộc)
 *        @details  - mô tả product (kiểu chuỗi, bắt buộc)
 *        @category - phân loại product (kiểu chuỗi, bắt buộc)
 *        @price    - giá tiền (kiểu số, bắt buộc)
 *        @image    - mảng link source hình ảnh (không bắt buộc)
 *        @createdBy- object người tạo sản phẩm
 *        @comments - mảng chứa tất cả bình luận
 * @Arg2  "timestamps: true" - tự động thêm createdAt và updatedAt
 */
const productSchema = new Schema({
  id:         { type: String, required: true, unique: true },
  name:       { type: String, required: true }, 
  details:    { type: String, required: true },
  category:   { type: String, required: true },      
  price:      { type: Number, required: true },
  image:      { type: Array, default: [] }, 
  createdBy:  { type: createdBySchema, required: true },
  comments:   [commentSchema]     
  }, { timestamps: true });

/** Tạo model có tên là 'Product'. Mongoose sẽ tự map model 'productSchema' này sang collection products (dạng số nhiều, chữ thường).
 *  'module.exports' cho phép import model này ở file khác bằng require('./models/Product')
 */
module.exports = mongoose.model("Product", productSchema);
