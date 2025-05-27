/**
 * @title     App component
 * @brief     App (main) components of MyMoney project
 * @filename  App.js
 ----------------------------------------------------------------------------- 
 * @author
 * @nation
 * @date 
 */



/** -------------------------------------------------------------------------- 
  @IMPORT --------------------------------------------------------------------
--------------------------------------------------------------------------- */
/** React components (React) */
import React from 'react';

/** React route components (BrowserRouter, Route, Routes, Navigate) */
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

/** Page components */
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'                   // Login page
import Signup from './pages/signup/Signup'                // Sign up page
import Project from './pages/project/Project'

/** Custom hooks */
import { useAuthContext } from './hooks/useAuthContext'   // Hooks để sủ dụng context chứa xác minh người dùng

/** Custom Components */
import Navbar from './components/Navbar'                  // Navigation bar
import Sidebar from './components/Sidebar'                // Side bar
import OnlineUsers from './components/OnlineUsers'        // User list bar

/** Styles */
import './App.css'



/** -------------------------------------------------------------------------- 
  @COMPONENT_FUNCTIONS -------------------------------------------------------
--------------------------------------------------------------------------- */
/**   App components
 * @returns None
 */
function App() {
  /** object gồm các component xử lý xác minh người dùng
   * @user          global component chứa thông tin người dùng
   * @authIsReady   global component cờ báo đã xác minh người dùng
   */
  const { user, authIsReady } = useAuthContext()

  return (
    /** thẻ div đại diện App component */
    <div className="App">
      
      {authIsReady && (
        /* gói toàn bộ hệ thống routing */
        <BrowserRouter>

          {/* kiểm tra lỗi */}
          {/*<React.StrictMode>*/}
          
          {/* Sidebar component, chỉ hiển thị khi đã log in */}
          {user && <Sidebar />}

          {/* thẻ div chứa nôi dung của App */}
          <div className="container">
            {/* Navbar component */}
            <Navbar />

            {/* Switch case render route (chi sử dụng components đầu tiên khớp với URL) */} 
            <Routes>

              {/** URL path: "/" 
                *  Nếu chưa đăng nhập tài khoản, chuyển hướng URL: "/login"
                *  Nếu đã đăng nhập tài khoản, mở Dashboard page component 
                */}
              <Route path="/" element={
                user ? <Dashboard /> : <Navigate to="/login" replace />
              }/>

              {/** URL path: "/create" mở create page component 
                *  Nếu chưa đăng nhập tài khoản, chuyển hướng URL: "/login"
                *  Nếu đã đăng nhập tài khoản, mở create page component 
                */}
              <Route path="/create" element={
                user ? <Create /> : <Navigate to="/login" replace />
              }/>

              {/** URL path: "/projects/:id" mở project page component theo id 
                *  Nếu chưa đăng nhập tài khoản, chuyển hướng URL: "/login"
                *  Nếu đã đăng nhập tài khoản, mở project page component 
                */}
              <Route path="/projects/:id" element={
                user ? <Project /> : <Navigate to="/login" replace />
              }/>

              {/** URL path: "/login" 
                *  Nếu đã đăng nhập tài khoản, chuyển hướng URL: "/"
                *  Nếu chưa đăng nhập tài khoản, mở login page component 
                */}
              <Route path="/login" element={
                user ? <Navigate to="/" replace /> : <Login />
              }/>

              {/** URL path: "/signup" 
                *  Nếu đã đăng nhập tài khoản, chuyển hướng URL: "/"
                *  Nếu chưa đăng nhập tài khoản, mở signup page component 
                */}
              <Route path="/signup" element={
                (user && user.displayName) ? <Navigate to="/" replace /> : <Signup />
              }/>

            </Routes>

          {/*</React.StrictMode>*/} 
          </div>

          {/* User list bar component, chỉ hiển thị khi đã log in */}
          {user && <OnlineUsers />}

        </BrowserRouter>
      )}
      
    </div>
  );
}

export default App;
