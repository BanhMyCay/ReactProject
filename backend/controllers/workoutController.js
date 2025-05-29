/**
 * @title     Controller for workouts collection
 * @brief     Define function to control  workouts collection on Database
 * @filename  workoutController.js
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
const mongoose = require('mongoose')                  // component liên kết với tập thư viện dùng để kết nối và làm việc với MongoDB

/** Models define */
const Workout = require('../models/workoutModel')     // component liên kết với Model đã được định nghĩa  Define structure for workouts collection on Database



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Component gọi hàm lấy tất cả document từ workouts collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const getWorkouts = async (req, res) => {
  /** Hàm lấy tất cả documents 'Workout.find({})' trong collection workouts lưu vào component 'workouts' 
   * '.sort({ createdAt: -1 })' sắp xếp theo thời gian tạo, mới nhất lên đầu
   */  
  const workouts = await Workout.find({}).sort({createdAt: -1})

  /** gửi kết quả về client với mã trạng thái 200 OK */
  res.status(200).json(workouts)
}

/** Component gọi hàm lấy 1 document từ workouts collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const getWorkout = async (req, res) => {
  /** Lấy id từ URL */
  const { id } = req.params

  /** Kiểm tra nếu id không hợp lệ (không phải ObjectId của MongoDB) thì trả về lỗi 404 */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No such workout'})
  }

  /** Hàm lấy 1 document với id 'Workout.findById(id)' trong collection workouts lưu vào component 'workout' */  
  const workout = await Workout.findById(id)

  /** Nếu không lấy được document: trả về lỗi. */
  if (!workout) {
    return res.status(404).json({error: 'No such workout'})
  }

  /** Nếu tìm thấy: gửi về client với mã 200 OK. */
  res.status(200).json(workout)
}

/** Component gọi hàm tạo 1 document trên workouts collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const createWorkout = async (req, res) => {
  /** object chứa các biến trạng thái lấy từ request để tạo collections */
  const {title, load, reps} = req.body

  try { 
    /** Hàm tạo document mới ('Workout.create') trong MongoDB 'Workout.create' 
     *  Component 'workout' tạm chứa document vừa tạo
     */
    const workout = await Workout.create({title, load, reps})

    /** Nếu tạo thành công, trả về JSON của document với HTTP status 200 OK */
    res.status(200).json(workout)
  } catch (error) {
    /** Nếu có lỗi (thiếu trường, sai kiểu dữ liệu, v.v.), bắt lỗi và trả về status 400 Bad Request kèm thông báo lỗi. */
    res.status(400).json({error: error.message})
  }
}

/** Component gọi hàm xóa 1 document trên workouts collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const deleteWorkout = async (req, res) => {
  /** Lấy id từ URL */
  const { id } = req.params

  /** Kiểm tra nếu id không hợp lệ (không phải ObjectId của MongoDB) thì trả về lỗi 400 Bad Request */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such workout'})
  }

  /** Hàm xóa document theo id ('Workout.findOneAndDelete') trong MongoDB 'Workout.create' 
   *  Component 'workout' tạm chứa document tìm được (chưa xóa)
   * @Arg1  '{_id: id}' - id của document
   */
  const workout = await Workout.findOneAndDelete({_id: id})

  /** Nếu không lấy được document: trả về lỗi. */
  if(!workout) {
    return res.status(400).json({error: 'No such workout'})
  }

  /** Nếu tìm thấy: gửi về client với mã 200 OK. */
  res.status(200).json(workout)
}

/** Component gọi hàm sửa 1 document trên workouts collection (dùng 'async/await' để xử lý bất đồng bộ)
 * @Arg1 req - request đến địa chỉ URL
 * @Arg2 res - respone lên route
 */
const updateWorkout = async (req, res) => {
  /** Lấy id từ URL */
  const { id } = req.params

  /** Kiểm tra nếu id không hợp lệ (không phải ObjectId của MongoDB) thì trả về lỗi 400 Bad Request */
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No such workout'})
  }

  /** Hàm sửa document theo id ('Workout.findOneAndUpdate') trong MongoDB 'Workout.create' 
   *  Component 'workout' tạm chứa document tìm được (chưa sửa)
   * @Arg1  '{_id: id}' - id của document
   * @Arg2  nội dung cần sửa
   */
  const workout = await Workout.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  /** Nếu không lấy được document: trả về lỗi. */
  if (!workout) {
    return res.status(400).json({error: 'No such workout'})
  }

  /** Nếu tìm thấy: gửi về client với mã 200 OK. */
  res.status(200).json(workout)
}

/** Xuất các hàm để dùng trong router */
module.exports = {
  getWorkouts,        // lấy tất cả documents
  getWorkout,         // lấy 1 document
  createWorkout,      // tạo 1 document
  deleteWorkout,      // xóa 1 document   
  updateWorkout       // sửa 1 document
}