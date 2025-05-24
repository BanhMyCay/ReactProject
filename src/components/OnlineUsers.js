/**
 * @title     Online user bar
 * @brief     Component online user bar for page components
 * @filename  OnlineUsers.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



 /** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hooks */
import { useCollection } from '../hooks/useCollection'  // liên kết collection trên database của firebase

/** Custom component */
import Avatar from './Avatar'               // Avatar component

/** Styles */
import './OnlineUsers.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Online user bar component */
export default function OnlineUsers() {
  /** object gồm các component liên kết collection trên database của firebase
   * @documents     component chứa các documents của collection
   * @error         component chuỗi ký tự báo lỗi
   * @components    cờ báo đang làm việc với database
   */
  const { isPending, error, documents } = useCollection('users')

  return (
    /** thẻ div đai diện user bar 
     *   @class
    */
    <div className="user-list">
      {/** thẻ h2 chứa tiêu đề của bar */}
      <h2>All Users</h2>

      {/** thẻ div khi đang làm việc với firebase */}
      {isPending && <div>Loading users...</div>}

      {/** thẻ di báo lỗi khi làm việc với firebase */}
      {error && <div>{error}</div>}

      {/** hàm map từng object user trong components document 
       * @key   đại diện object
      */}
      {documents && documents.map(user => (
        /** thẻ div đại diện 1 user 
         *                 @class
         */
        <div key={user.id} className="user-list-item">
          {/** thẻ span báo user đang online */}
          {user.online && <span className="online-user"></span>}
          {/** thẻ span chứa tên user */}
          <span>{user.displayName}</span>
          {/** component avatar */}
          <Avatar src={user.photoURL} />
        </div>
      ))}
    </div>
  )
}