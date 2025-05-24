/**
 * @title     Ceate page
 * @brief     Component Ceate page of The Dojo project
 * @filename  Home.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** Custom hooks */
import { useAuthContext } from '../../hooks/useAuthContext' // Hooks để sủ dụng context chứa xác minh người dùng
import { useCollection } from '../../hooks/useCollection'   // Hooks liên kết collection trên database của firebase

/** Custom components */

/** Styles */
import './Create.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Create page component */
export default function Ceate() {

  return (
    /** thẻ div đại diện create page */
    <div>
      Create
    </div>
  )
}

