/**
 * @title     Navigation bar
 * @brief     Component navigation bar for page components
 * @filename  Navbar.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



 /** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route components (Link) */
import { Link } from "react-router-dom"

/** Custom hooks */
import { useLogout } from '../hooks/useLogout'                // Hooks để thực hiện đăng xuất tài khoản
import { useAuthContext } from '../hooks/useAuthContext'      // Hooks để sủ dụng context chứa xác minh người dùng

/** Styles */
import './Navbar.css'

/** Images */
import Temple from '../assets/temple.svg'                     // logo project



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Navigation bar component */
export default function Navbar() {
  /**   object các components của custom hook (useSignup)
   * @Ret1  logout    - hàm thực hiện đăng xuất tài khoản
   * @Ret2  isPending - components cờ báo đang làm việc với database
   */
  const { logout, isPending } = useLogout()

  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  return (
    /** thẻ div đại diện Navbar component 
     *   @class riêng cho style
     */
    <nav className="navbar">

      {/** thẻ ul chứa các thẻ li của Navbar */}
      <ul>
        {/** thẻ li chứa tiêu đề của Navbar 
         *  @class riêng cho style
         */}
        <li className="logo">
          {/** thẻ img chứa ảnh logo của Navbar 
           * @src nguồn ảnh
           * @alt tiêu đề ảnh
           */}
          <img src={Temple} alt="dojo logo" />
          {/** thẻ span chứa tiêu đề của Navbar */}
          <span><Link to="/">The Dojo</Link></span>
        </li>
        
        {/** chỉ hiển thị các thẻ sau nếu chưa có thông tin xác minh người dùng */}
        {!user && (
          <>
            {/** thẻ li chứa URL đến các pages Login và Sign up
              *  @Link URL đến các page
              */}
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}

        {/** chỉ hiển thị các thẻ sau nếu đã có thông tin xác minh người dùng */}
        {user && (
          <>
            {/** thẻ li chứa nút nhấn thực hiện đăng xuất tài khoản */}
            <li>
              {/** thẻ button chứa nút nhấn thực hiện đăng xuất tài khoản
               *                     @class          @handleClick
               */}
              {!isPending && <button className="btn" onClick={logout}>Logout</button>}
              {isPending && <button className="btn" disabled>Logging out...</button>}
            </li>
          </>
        )}
      </ul>

    </nav>
  )
}