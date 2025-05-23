/**
 * @title     Login page
 * @brief     Component login page of The Dojo project
 * @filename  Login.js
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
import { useLogin } from '../../hooks/useLogin'               // hooks thực hiện đăng nhập tài khoản

/** Styles */
import './Login.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Login page component */
export default function Login() {

  const [email, setEmail] = useState('')                            //  components lưu tạm email từ form đăng nhập
  const [password, setPassword] = useState('')                      //  components lưu tạm password từ form đăng nhập

  /**   object các components của custom hook (useLogin)
   * @Ret1  login     - hàm thực hiện đăng nhập tài khoản
   * @Ret2  isPending - components cờ báo đang làm việc với database
   * @Ret3  error     - components chuỗi ký tự báo lỗi
   */
  const { login, isPending, error } = useLogin()    

  /**   hàm xử lý sự kiện submit khi ấn nút đăng nhập
   * @e    sự kiện submit
   */
  const handleSubmit = (e) => {
    e.preventDefault()                      // ngăn xử lý mặc định của sự kiện (reload pages)
    /** hàm thực hiện đăng nhập tài khoản sử dụng dịch vụ firebase authentication */
    login(email, password)  
  }

  return (
    /** thẻ div đại diện Login page */
    <div>

      {/** thẻ form chứa các input của form đăng nhập
       *    @handleSubit            @class sử dụng syles 'login-form'
       */}
      <form onSubmit={handleSubmit} className="login-form">
        
        {/** thẻ h2 chứa tiêu đề của form đăng nhập */}
        <h2>login</h2>
        
        {/** thẻ label đại diện ô input email */}
        <label>
          {/** thẻ span chứa tiêu đề ô input email */}
          <span>email:</span>
          {/** thẻ input để điền email 
           * @type      loại input email (yêu cầu có đuôi @)
           * @onChange  khi input thay đổi sẽ đặt giá trị components password theo giá trị input
           * @value     giá trị của input thay đổi theo components password
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
           * @onChange  khi input thay đổi sẽ đặt giá trị components email theo giá trị input
           * @value     giá trị của input thay đổi theo components email
           * @required  bắt buộc có giá trị
          */}
          <input 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            required 
          />
        </label>

        {/** thẻ button nút đăng nhập, chỉ click được khi không làm việc với database (isPending)
         *                      @class
        */}
        { !isPending && <button className="btn">Login</button> }
        { isPending && <button className="btn" disabled>loading</button> }

        {/** thẻ p hiển thị lỗi nếu có lỗi (component error) */}
        { error && <p>{error}</p> }

      </form>

    </div>
  )
}

