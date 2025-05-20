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
import styles from './Navbar.module.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   Navigation bar component
 * @returns None
 */
export default function Navbar() {
  /**   object các components của custom hook (useSignup)
   * @Ret1  logout    - hàm thực hiện đăng xuất tài khoản
   */
  const { logout } = useLogout()

  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  return (
    /** thẻ div đại diện Navbar component 
     *   @class riêng cho style
     */
    <nav className={styles.navbar}>

      {/** thẻ ul chứa các thẻ li của Navbar */}
      <ul>
        {/** thẻ li chứa tiêu đề của Navbar 
         *  @class riêng cho style
         */}
        <li className={styles.title}><Link to="/">myMoney</Link></li>
        
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
            {/** thẻ li chứa thông tin người dùng */}
            <li>hello, {user.displayName}</li>

            {/** thẻ li chứa nút nhấn thực hiện đăng xuất tài khoản */}
            <li>
              {/** thẻ button chứa nút nhấn thực hiện đăng xuất tài khoản
               *      @class          @handleClick
               */}
              <button className="btn" onClick={logout}>Logout</button>
            </li>
          </>
        )}
      </ul>

    </nav>
  )
}