/**
 * @title     Dashboard page
 * @brief     Component Dashboard page of The Dojo project
 * @filename  Dashboard.js
 ----------------------------------------------------------------------------- 
 * @author    BanhMyCay
 * @nation    VietNam
 * @date      04/06/2025
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React component (useState) */
import { useState } from 'react'

/** Custom hooks */
import { useCollection } from '../../hooks/useCollection'   // Hooks liên kết collection trên database của firebase
import { useMyCart } from "../../hooks/useMyCart"           // hooks để làm việc với giỏ hàng của user

/** Page components */
import ProductFilter from './ProductFilter'                 // Bộ lọc product của dashboard page

/** Custom components */
import ProductList from '../../components/ProductList'      // Product list


/** Styles */
import './Dashboard.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/** Dashboard page component */
export default function Dashboard() {
  /** object chứa các component được liên kết với hooks liên kết collection trên database của firebase
   * @documents component chứa các documents của collection
   * @error     component chuỗi ký tự báo lỗi
   */
  const { documents, error } = useCollection('products', null, null, true)

  console.log(documents)

  /** object gồm các component liên kết với hooks để làm việc với giỏ hàng của user
   * @addProductToCart  Hàm thêm sản phẩm vào giỏ hàng
   */
  const { addProductToCart } = useMyCart()

  const [filter, setFilter] = useState('all')     // component lưu từ để lọc

  /** hàm thay đổi từ để lọc 
   * @Arg1  newFilter - từ mới để lọc
   */
  const changeFilter = (newFilter) => {
    setFilter(newFilter)
  }

  /** hàm để thêm "product" vào giỏ hàng 
   * @Arg1  newFilter - từ mới để lọc
   */
  const handleAddToCart = (product) => {
    /** Hàm thêm sản phẩm vào giỏ hàng
     * @Arg1  product - object thông tin sản phẩm cần thêm
     */
    addProductToCart(product)
  }

  /** nếu collection có documents, sử dụng hàm lọc (filter - true giữ/false bỏ) với các object 
   *  trong component chứa các documents
   * @projects component chứa tât cả object được lọc từ component 'documents' 
   */
  const products = documents ? documents.filter(document => {
    switch(filter) {
      case 'all':       // không lọc, tất cả object trả về true
        return true
      case 'beauty':
      case 'fragrances':
      case 'furniture':
      case 'groceries':
        console.log(document.category, filter)
        return document.category === filter       // lọc theo phân loại project
      default:
        return true
    }
  }) 
  .sort((a, b) => a.name.localeCompare(b.name))   // 👉 Sắp xếp theo tên sản phẩm (tăng dần)
  : null

  return (
    /** thẻ div đại diện Dashboard page */
    <div>
      {/** thẻ h2 chứa tiêu đề của page */}
      <h2 className="page-title">Dashboard</h2>

      {/** thẻ p báo lỗi nếu có lỗi khi làm việc với database */}
      {error && <p className="error">{error}</p>}
      
      {/** Bộ lọc cho dashboard page nếu component array "documents" có dữ liệu */}
      {documents && <ProductFilter changeFilter={changeFilter} />}

      {/** Prodyct list component nếu component array "products" có dữ liệu */}
      {products && <ProductList products={products} handleAddToCart={handleAddToCart} />}
    </div>
  )
}

