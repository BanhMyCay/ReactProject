/**
 * @title     Dashboard page (ProjectFilter)
 * @brief     Component ProjectFilter của dashboard page of The Dojo project
 * @filename  ProjectFilter.js
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



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** component array chứa các từ để lọc */
const filterList = ['all', 'mine', 'development', 'design', 'marketing', 'sales']



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** ProjectFilter của dashboard page of The Dojo project 
 * @Arg1  changeFilter  - hàm để thay đổi từ lọc
 */
export default function ProjectFilter({ changeFilter }) {
  const [currentFilter, setCurrentFilter] = useState('all') // component tạm lưu từ để lọc

  /** xử lý khi chọn từ để lọc khác */
  const handleClick = (newFilter) => {
    setCurrentFilter(newFilter)       // udpate component tạm lưu từ để lọc
    changeFilter(newFilter)           // gọi hàm để thay đổi từ lọc
  }

  return (
    /** thẻ div đại diện bộ lọc */
    <div className="project-filter">
      {/** thẻ nav chứa bảng bộ lọc */}
      <nav>
        {/** thẻ p chứa tiêu đề bộ lọc */}
        <p>Filter by: </p>

        {/** map đến từng object (f) lưu từ để lọc trong mảng filterList 
         * @key từ để lọc
         */}
        {filterList.map((f) => (
          /** thẻ button để chọn từ lọc 
           * @onClick   hàm xử lý khi nhấn nút (handleClick)
           * @class     để styles khi được chọn và không chọn
           */
          <button key={f}
            onClick={() => handleClick(f)}
            className={currentFilter === f ? 'active' : ''}
          >{f}</button>
        ))}
      </nav>
    </div>
  )
}