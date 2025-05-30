/**
 * @title     Controller for products collection
 * @brief     Define function to control  products collection on Database
 * @filename  productController.js
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
const mongoose = require("mongoose"); // component liên kết với tập thư viện dùng để kết nối và làm việc với MongoDB

/** Models define */
const Product = require("../models/productModel"); // component liên kết với Model đã được định nghĩa  Define structure for products collection on Database



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Component gọi hàm lấy tất cả document từ products collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const getProducts = async (req, res) => {
  /** Hàm lấy tất cả documents 'Product.find({})' trong collection products lưu vào component 'products'
   * '.sort({ createdAt: -1 })' sắp xếp theo thời gian tạo, mới nhất lên đầu
   */
  const products = await Product.find({}).sort({ createdAt: -1 });

  /** gửi kết quả về client với mã trạng thái 200 OK */
  res.status(200).json(products);
};

/** Component gọi hàm lấy 1 document từ products collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const getProduct = async (req, res) => {
  /** Lấy id từ URL */
  const { id } = req.params;

  /** Kiểm tra nếu id không hợp lệ (không phải ObjectId của MongoDB) thì trả về lỗi 404 */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such product" });
  }

  /** Hàm lấy 1 document với id 'Product.findById(id)' trong collection products lưu vào component 'product' */
  const product = await Product.findById(id);

  /** Nếu không lấy được document: trả về lỗi. */
  if (!product) {
    return res.status(404).json({ error: "No such product" });
  }

  /** Nếu tìm thấy: gửi về client với mã 200 OK. */
  res.status(200).json(product);
};

/** Component gọi hàm tạo 1 document trên products collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const createProduct = async (req, res) => {
  /** object chứa các biến trạng thái lấy từ request để tạo collections */
  const { productId, title, category, price, image } = req.body;

  try {
    /** Hàm tạo document mới ('Product.create') trong MongoDB 'Product.create'
     *  Component 'product' tạm chứa document vừa tạo
     */
    const product = await Product.create({
      productId,
      title,
      category,
      price,
      image,
    });

    /** Nếu tạo thành công, trả về JSON của document với HTTP status 200 OK */
    res.status(200).json(product);
  } catch (error) {
    /** Nếu có lỗi (thiếu trường, sai kiểu dữ liệu, v.v.), bắt lỗi và trả về status 400 Bad Request kèm thông báo lỗi. */
    res.status(400).json({ error: error.message });
  }
};

/** Component gọi hàm xóa 1 document trên products collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const deleteProduct = async (req, res) => {
  /** Lấy id từ URL */
  const { id } = req.params;

  /** Kiểm tra nếu id không hợp lệ (không phải ObjectId của MongoDB) thì trả về lỗi 400 Bad Request */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such product" });
  }

  /** Hàm xóa document theo id ('Product.findOneAndDelete') trong MongoDB 'Product.create'
   *  Component 'product' tạm chứa document tìm được (chưa xóa)
   * @Arg1  '{_id: id}' - id của document
   */
  const product = await Product.findOneAndDelete({ _id: id });

  /** Nếu không lấy được document: trả về lỗi. */
  if (!product) {
    return res.status(400).json({ error: "No such product" });
  }

  /** Nếu tìm thấy: gửi về client với mã 200 OK. */
  res.status(200).json(product);
};

/** Component gọi hàm sửa 1 document trên products collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const updateProduct = async (req, res) => {
  /** Lấy id từ URL */
  const { id } = req.params;

  /** Kiểm tra nếu id không hợp lệ (không phải ObjectId của MongoDB) thì trả về lỗi 400 Bad Request */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such product" });
  }

  /** Hàm sửa document theo id ('Product.findOneAndUpdate') trong MongoDB 'Product.create'
   *  Component 'product' tạm chứa document tìm được (chưa sửa)
   * @Arg1  '{_id: id}' - id của document
   * @Arg2  nội dung cần sửa
   */
  const product = await Product.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  /** Nếu không lấy được document: trả về lỗi. */
  if (!product) {
    return res.status(400).json({ error: "No such product" });
  }

  /** Nếu tìm thấy: gửi về client với mã 200 OK. */
  res.status(200).json(product);
};



/** Xuất các hàm để dùng trong router */
module.exports = {
  getProducts,    // lấy tất cả documents
  getProduct,     // lấy 1 document
  createProduct,  // tạo 1 document
  deleteProduct,  // xóa 1 document
  updateProduct,  // sửa 1 document
};
