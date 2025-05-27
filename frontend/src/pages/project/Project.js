/**
 * @title     Project page
 * @brief     Component Project page of The Dojo project
 * @filename  Project.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React route components */
import { useParams } from "react-router-dom"

/** Custom hooks */
import { useDocument } from '../../hooks/useDocument'

/** Page components */
import ProjectSummary from "./ProjectSummary"     // component chứa nội dung của project page
import ProjectComments from "./ProjectComments"   // component chứa ô comment cho project page

/** Styles */
import './Project.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Project page component */
export default function Project() {
  /** object chứa các component liên kết với hooks (useParams) để lấy thuộc tính 
   *  sau đuôi URL /:<properties> 
   */
  const { id } = useParams()

  /** object chứa các components liên kết với hooks để sử dụng document có id 'id' của 
   *  collection 'projects' trên firestore của firebase 
   * @document  component liên kết với document
   * @error     component lỗi khi sử dụng hook
   */
  const { document, error } = useDocument('projects', id)

  if (error) {    // nếu lỗi trả về thẻ báo lỗi
    return <div className="error">{error}</div>
  }
  if (!document) {// nếu không có documents trả về thẻ báo lỗi
    return <div className="loading">Loading...</div>
  }

  return (
    /** thẻ div đại diện Project page 
     *   @class
     */
    <div className="project-details">
      {/** ProjectSummary component hiển thị chi tiêt project */}
      <ProjectSummary project={document} />

      {/** ProjectComments component để bình luận về project */}
      <ProjectComments project={document} />
    </div>
  )
}

