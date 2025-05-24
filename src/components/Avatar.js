/**
 * @title     Avatar component
 * @brief     Component Avatar
 * @filename  Avatar.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



 /** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Styles */
import './Avatar.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Avatar component 
 * @src     nguồn lấy ảnh
 */
export default function Avatar({ src }) {
  return (
    /** thẻ div đại diện Avatar component 
     *   @class
     */
    <div className="avatar">
      {/** thẻ div đại diện Avatar component 
        * @src  nguồn ảnh
        * @alt  tiêu đề ảnh
        */}
      <img src={src} alt="user avatar" />
    </div>
  )
}