/**
 * @title     Side bar
 * @brief     Component Side bar for page components
 * @filename  Sidebar.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route components (Link) */
import { NavLink } from "react-router-dom"

/** Custom hooks */
import { useAuthContext } from '../hooks/useAuthContext'    // hooks sủ dụng context chứa xác minh người dùng

/** Custom component */
import Avatar from "./Avatar"                               // Avatar

/** Styles */
import "./Sidebar.css"

/** Images */
import DashboardIcon from '../assets/dashboard_icon.svg'    // Dashboard icon
import AddIcon from '../assets/add_icon.svg'                // add icon 



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Side bar component */
export default function Sidebar() {
  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()
  
  return (
    /** thẻ div đại diện Sidebar component 
     *   @class riêng cho style
     */
    <div className="sidebar">

      {/** thẻ div chứa nôi dung của Sidebar 
        *  @class riêng cho style
        */}
      <div className="sidebar-content">

        {/** thẻ div chứa thông tin người dung
          *  @class riêng cho style
          */}
        <div className="user">
          {/** component avatar
            *  @src nguồn lấy ảnh
            */}
          <Avatar src={user.photoURL} />
          <p>Hey {user.displayName}</p>  
        </div>  
         

        {/** thẻ nav chứa bảng điều khiển của người dung
          *  @class riêng cho style
          */}
        <nav className="links">
          <ul>
            {/** thẻ li chứa URL đến các pages Dashboard
              * @NavLink URL đến các page
              */}
            <li>
              <NavLink exact to="/">
                {/** thẻ img chứa logo của Dashboard
                  *  @src ảnh            @alt tiêu đề
                  */}
                <img src={DashboardIcon} alt="dashboard icon" />
                {/* thẻ span chứa tiêu đề Dashboard */}
                <span>Dashboard</span>
              </NavLink>
            </li>
            {/** thẻ li chứa URL đến các pages create
              * @NavLink URL đến các page
              */}
            <li>
              <NavLink to="/create">
                {/** thẻ img chứa logo của create page
                  *  @src ảnh            @alt tiêu đề
                  */}
                <img src={AddIcon} alt="add project icon" />
                {/* thẻ span chứa tiêu đề create page */}
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </nav>

      </div>

    </div>
  )
}