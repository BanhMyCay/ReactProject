/**
 * @title     workouts collection define
 * @brief     Define structure for workouts collection on Database
 * @filename  workoutModels.js
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



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Constructor là một hàm đặc biệt được sử dụng để tạo và khởi tạo đối tượng (object) khi sử dụng từ khóa new */
/** Component gắn với constructor Schema từ mongoose, dùng để định nghĩa cấu trúc dữ liệu cho các documents trong MongoDB */
const Schema = mongoose.Schema

/** Định nghĩa cấu trúc dữ liệu cho user model dùng trong (assignedUsersList hoặc createdBy) để lưu trên database 
 * @Arg1  Trường dữ liệu tự tạo
 *        @displayName  - tên user (kiểu chuỗi, bắt buộc)
 *        @id           - id của user (kiểu chuỗi, bắt buộc)
 *        @photoURL     - nguồn Avatar (kiểu chuỗi, mặc định null).
 * @Arg2  '_id: false'  - tắt tính năng tự động tạo id
 */
const userSchema = new Schema({
  displayName: { 
    type: String, 
    required: true 
  },
  id: { 
    type: String, 
    required: true 
  },
  photoURL: { 
    type: String, 
    default: null 
  }
}, { _id: false })

/** Định nghĩa cấu trúc dữ liệu cho mỗi comment
 * @Arg1  Trường dữ liệu tự tạo
 *        @content      - nội dung (kiểu chuỗi, bắt buộc)
 *        @createdAt    - ngày comment (kiểu ngày tháng, bắt buộc)
 *        @displayName  - tên người comment (kiểu chuỗi, bắt buộc)
 *        @id           - id người comment (kiểu chuỗi, bắt buộc)
 *        @photoURL     - nguồn Avatar người comment (kiểu chuỗi, mặc định null).
 * @Arg2  '_id: false'  - tắt tính năng tự động tạo id
 */
const commentSchema = new Schema({
  content: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    required: true 
  },
  displayName: { 
    type: String, 
    required: true 
  },
  id: {
    type: Number, 
    required: true 
  },
  photoURL: { 
    type: String, 
    default: null 
  }
}, { _id: false })

/** Định nghĩa cấu trúc dữ liệu chính cho workout
 * @Arg1  Trường dữ liệu tự tạo
 *        @name               - tên workout (kiểu chuỗi, bắt buộc)
 *        @details            - mô tả workout (kiểu chuỗi, bắt buộc)
 *        @category           - phân loại workout (kiểu chuỗi, bắt buộc)
 *        @dueDate            - hạn workout (kiểu ngày giời, bắt buộc)
 *        @createdAt          - ngày tạo (kiểu ngày giời, mặc định thời điểm hiện tại)
 *        @createdBy          - người tạo (kiểu 'userSchema', bắt buộc)
 *        @assignedUsersList  - danh sach người được phân công (kiểu 'userSchema')
 *        @comments           - các bình luận (kiểu 'commentSchema')
 * @Arg2  '_id: false'  - tắt tính năng tự động tạo id
 */
const workoutSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },                    
  details: { 
    type: String, 
    required: true 
  },   
  category: { 
    type: String, 
    required: true 
  }, 
  dueDate: { 
    type: Date, 
    required: true 
  },          
  createdAt: { 
    type: Date, 
    default: Date.now
  },               
  createdBy: { 
    type: userSchema, 
    required: true 
  }, 
  assignedUsersList: { 
    type: [userSchema], 
    default: [] 
  },
  comments: { 
    type: [commentSchema], 
    default: [] 
  } 
})



/** Tạo model có tên là 'Workout'. Mongoose sẽ tự map model 'workoutSchema' này sang collection workouts (dạng số nhiều, chữ thường).
 *  'module.exports' cho phép import model này ở file khác bằng require('./models/Workout') 
 */
module.exports = mongoose.model('Workout', workoutSchema)