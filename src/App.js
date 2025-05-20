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

/** React route components (BrowserRouter, Switch, Route, Redirect) */
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

/** Page components */
import Home   from './pages/home/Home'                    // Home page
import Login  from './pages/login/Login'                  // Login page
import { Signup } from './pages/signup/Signup'            // Sign up page

/** Custom hooks */
import { useAuthContext } from './hooks/useAuthContext'   // Hooks để sủ dụng context chứa xác minh người dùng

/** Custom Components */
import Navbar from './components/Navbar'                  // Navigation bar



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
      
            {/* Navbar component */}
            <Navbar />

            {/* Switch case render route (chi sử dụng components đầu tiên khớp với URL) */} 
            <Switch>

              {/** URL exact path: "/" 
                *  Nếu chưa đăng nhập tài khoản, chuyển hướng URL: "/login"
                *  Nếu đã đăng nhập tài khoản, mở home page component 
                */}
              <Route exact path="/">
                {!user && <Redirect to="/login" />}
                {user && <Home />}
              </Route>

              {/** URL path: "/login" 
                *  Nếu đã đăng nhập tài khoản, chuyển hướng URL: "/"
                *  Nếu chưa đăng nhập tài khoản, mở login page component 
                */}
              <Route path="/login">
                {user && <Redirect to="/" />}
                {!user && <Login />}
              </Route>

              {/** URL path: "/signup" 
                *  Nếu đã đăng nhập tài khoản, chuyển hướng URL: "/"
                *  Nếu chưa đăng nhập tài khoản, mở signup page component 
                */}
              <Route path="/signup">
                {user && user.displayName && <Redirect to="/" />}
                {!user && <Signup />}
              </Route>

            </Switch>

          {/*</React.StrictMode>*/} 

        </BrowserRouter>
      )}
      
    </div>
  );
}

export default App;
