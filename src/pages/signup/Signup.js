/**
 * @title     Sign up page
 * @brief     Component sign up page of The Dojo project
 * @filename  Signup.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (useState) */
import { useState } from 'react'

/** Custom hooks */
import { useSignup } from '../../hooks/useSignup'               // hooks thực hiện đăng ký người dùng mới

/** Styles */
import './Signup.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Signup page component */
export default function Signup() {  

  const [email, setEmail] = useState('')                        // components lưu tạm email từ form đăng ký
  const [password, setPassword] = useState('')                  // components lưu tạm password từ form đăng ký
  const [displayName, setDisplayName] = useState('')            // components lưu tạm display name từ form đăng ký
  const [thumbnail, setThumbnail] = useState(null)              // components chứa tạm avatar
  const [thumbnailError, setThumbnailError] = useState(null)    // components lưu tạm lỗi khi chọn avatar

  /**   object các components của custom hook (useSignup)
   * @Ret1  signup    - hàm thực hiện đăng ký tài khoản mới
   * @Ret2  isPending - components cờ báo đang làm việc với database
   * @Ret3  error     - components chuỗi ký tự báo lỗi
   */
  const { signup, isPending, error } = useSignup()              

  /**   hàm xử lý sự kiện submit khi ấn nút đăng nhập
   * @e    sự kiện submit
   */
  const handleSubmit = (e) => {
    e.preventDefault()                          // ngăn xử lý mặc định của sự kiện (reload pages)

    /** hàm thực hiện đăng ký tài khoản mới sử dụng dịch vụ firebase authentication */
    signup(email, password, displayName, thumbnail)
  }

  /**   hàm xử lý sự kiện khi chọn file cho ảnh avatar
   * @e    sự kiện xảy ra hàm
   */
  const handleFileChange = (e) => {
    setThumbnail(null)                // clear component tạm chứa avatar
    let selected = e.target.files[0]  // component chứa file vừa chọn
    console.log(selected)             // log lại component

    if (!selected) {                  // không có file, báo lỗi
      setThumbnailError('Please select a file')
      return
    }
    if (!selected.type.includes('png' && 'jpeg')) { // không phải file ảnh, báo lỗi
      setThumbnailError('Selected file must be an image')
      return
    }
    if (selected.size > 100000) {     // kích thước file lớn, báo lỗi
      setThumbnailError('Image file size must be less than 100kb')
      return
    }
    
    setThumbnailError(null)           // clear components lưu lỗi
    setThumbnail(selected)            // lưu file ảnh vào component
    console.log('thumbnail updated')  // log đã chọn file ảnh
  }

  return (
    /** thẻ div đại diện Signup page */
    <div>

      {/** thẻ form chứa các input của form đăng ký
       *    @handleSubit            @class sử dụng syles 'signup-form'
       */}
      <form onSubmit={handleSubmit} className="auth-form">
        
        {/** thẻ h2 chứa tiêu đề của form đăng ký */}
        <h2>sign up</h2>
        
        {/** thẻ label đại diện ô input email */}
        <label>
          {/** thẻ span chứa tiêu đề ô input email */}
          <span>email:</span>
          {/** thẻ input để điền email 
           * @type      loại input email (yêu cầu có đuôi @)
           * @onChange  khi input thay đổi sẽ đặt giá trị components email theo giá trị input
           * @value     giá trị của input thay đổi theo components email
           * @required  bắt buộc có giá trị
          */}
          <input 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            required
          />
        </label>
        
        {/** thẻ label đại diện ô input password */}
        <label>
          {/** thẻ span chứa tiêu đề ô input password */}
          <span>password:</span>
          {/** thẻ input để điền password 
           * @type      loại input password (có thể ẩn hiện)
           * @onChange  khi input thay đổi sẽ đặt giá trị components password theo giá trị input
           * @value     giá trị của input thay đổi theo components password
           * @required  bắt buộc có giá trị
          */}
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            required
          />
        </label>
        
        {/** thẻ label đại diện ô input display name */}
        <label>
          {/** thẻ span chứa tiêu đề ô input display name */}
          <span>display name:</span>
          {/** thẻ input để điền display name 
           * @type      loại input text
           * @onChange  khi input thay đổi sẽ đặt giá trị components displayName theo giá trị input
           * @value     giá trị của input thay đổi theo components displayName
           * @required  bắt buộc có giá trị
          */}
          <input 
            type="text" 
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
            required
          />
        </label>

        {/** thẻ label đại diện lựa chọn ảnh avatar */}    
        <label>
          {/** thẻ span chứa tiêu đề ô input ảnh avatar */}
          <span>profile thumbnail:</span>
          {/** thẻ input chọn ảnh avatar
           * @type      loại input file ảnh
           * @onChange  khi input thay đổi sẽ xử lý file đã chọn
          */}
          <input 
            type="file" 
            onChange={handleFileChange}
          />
          {/** thẻ div báo lỗi khi có lỗi
           *                      @class
           */}
          {thumbnailError && <div className="error">{thumbnailError}</div>}
        </label>

        {/** thẻ button nút đăng ký, chỉ click được khi không làm việc với database (isPending)
         *                      @class
        */}
        { !isPending && <button className="btn">sign up</button> }
        { isPending &&  <button className="btn" disabled>loading</button> }
        
        {/** thẻ p hiển thị lỗi nếu có lỗi (component error) 
         *             @class
         */}
        {error && <div className="error">{error}</div>}

      </form>

    </div>
  )
}

