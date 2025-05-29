/**
 * @title     Workout Router
 * @brief     Task of Workout route for workouts collection
 * @filename  workout.js
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
const express = require('express')                    // component liên kết với return của express module    

/** Models define */
const {                                               // mảng chứa các hàm thao tác với workouts collection trên database
  getWorkouts,        // lấy tất cả documents
  getWorkout,         // lấy 1 document
  createWorkout,      // tạo 1 document
  deleteWorkout,      // xóa 1 document   
  updateWorkout       // sửa 1 document
} = require('../controllers/workoutController')



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Component router app, khởi tạo một "mini-app" chuyên xử lý các route liên quan đến một phần của ứng dụng */
const router = express.Router()

/** Route xử lý các request get tất cả document 
 * @Arg1  '/' - URL tạo req
 * @Arg2  hàm xử lý req (lấy tất cả documents)
 */
router.get('/', getWorkouts)

/** Route xử lý các request get 1 document cụ thể (theo ID)
 * @Arg1  '/:id' - URL tạo req, ':id' là tham số động từ URL, có thể truy cập qua req.params.id
 * @Arg2  hàm xử lý req (lấy tất 1 document theo id)
 */
router.get('/:id', getWorkout)

/** Route xử lý các request post 1 document 
 * @Arg1  '/' - URL tạo req
 * @Arg2  hàm xử lý req (tạo 1 document)
 */
router.post('/', createWorkout)

/** Route xử lý các request delete 1 document cụ thể (theo ID)
 * @Arg1  '/:id' - URL tạo req, ':id' là tham số động từ URL, có thể truy cập qua req.params.id
 * @Arg2  hàm xử lý req (xóa 1 document)
 */
router.delete('/:id', deleteWorkout)

/** Route xử lý các request patch - sửa 1 document cụ thể (theo ID) 
 * Route sửa một workout cụ thể (theo ID)
 * @Arg1  '/:id' - URL tạo req, ':id' là tham số động từ URL, có thể truy cập qua req.params.id
 * @Arg2  hàm xử lý req (sửa 1 document)
 */
router.patch('/:id', updateWorkout)

/** Export module */
module.exports = router