/**
 * @title     Dashboard page (ProductFilter)
 * @brief     Component ProductFilter của dashboard page of My Store project
 * @filename  ProductFilter.js
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

/** Styles */
import './Dashboard.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT -----------------------------------------------------------------
--------------------------------------------------------------------------- */
/** component array chứa các từ để lọc */
const filterList = ['all', 'beauty', 'fragrances', 'furniture', 'groceries']



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** ProductFilter của dashboard page 
 * @Arg1  changeFilter  - hàm để thay đổi từ lọc
 */
export default function ProductFilter({ changeFilter }) {
  const [currentFilter, setCurrentFilter] = useState('all') // component tạm lưu từ để lọc

  /** xử lý khi chọn từ để lọc khác */
  const handleClick = (newFilter) => {
    setCurrentFilter(newFilter)       // udpate component tạm lưu từ để lọc
    changeFilter(newFilter)           // gọi hàm để thay đổi từ lọc
  }

  return (
    /** thẻ div đại diện bộ lọc */
    <div className="product-filter">
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