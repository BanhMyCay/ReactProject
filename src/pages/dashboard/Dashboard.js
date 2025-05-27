/**
 * @title     Dashboard page
 * @brief     Component Dashboard page of The Dojo project
 * @filename  Dashboard.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React component (useState) */
import { useState } from 'react'

/** Custom hooks */
import { useAuthContext } from '../../hooks/useAuthContext' // Hooks để sủ dụng context chứa xác minh người dùng
import { useCollection } from '../../hooks/useCollection'   // Hooks liên kết collection trên database của firebase

/** Page components */
import ProjectFilter from './ProjectFilter'                 // Bộ lọc của dashboard page

/** Custom components */
import ProjectList from '../../components/ProjectList'      // Project list


/** Styles */
import './Dashboard.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Dashboard page component */
export default function Dashboard() {
  /** object gồm các component xử lý xác minh người dùng 
   * @user  global component chứa thông tin xác mình người dùng
   */
  const { user } = useAuthContext()

  /** object chứa các component được liên kết với hooks liên kết collection trên database của firebase
   * @documents component chứa các documents của collection
   * @error     component chuỗi ký tự báo lỗi
   */
  const { documents, error } = useCollection('projects')

  const [filter, setFilter] = useState('all')     // component lưu từ để lọc

  /** hàm thay đổi từ để lọc 
   * @Arg1  newFilter - từ mới để lọc
   */
  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }

  /** nếu collection có documents, sử dụng hàm lọc (filter - true giữ/false bỏ) với các object 
   *  trong component chứa các documents
   * @projects component chứa tât cả object được lọc từ component 'documents' 
   */
  const projects = documents ? documents.filter(document => {
    switch(filter) {
      case 'all':       // không lọc, tất cả object trả về true
        return true
      case 'mine':      // lọc proecjt chỉ định user làm
        let assignedToMe = false                  // component báo true/false 
        document.assignedUsersList.forEach(u => { // quét từng người được chỉ định (u)
          if(u.id === user.uid) {                 // đúng id người chỉ định
            assignedToMe = true                   // báo true
          }
        })
        return assignedToMe
      case 'development':
      case 'design':
      case 'sales':
      case 'marketing':
        console.log(document.category, filter)
        return document.category === filter       // lọc theo phân loại project
      default:
        return true
    }
  }) : null

  return (
    /** thẻ div đại diện Dashboard page */
    <div>
      {/** thẻ h2 chứa tiêu đề của page */}
      <h2 className="page-title">Dashboard</h2>

      {/** thẻ p báo lỗi nếu có lỗi khi làm việc với database */}
      {error && <p className="error">{error}</p>}
      
      {/** Bộ lọc cho dashboard page nếu component array documents có dữ liệu */}
      {documents && <ProjectFilter changeFilter={changeFilter} />}

      {/** Project list component nếu component array projects có dữ liệu */}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}

