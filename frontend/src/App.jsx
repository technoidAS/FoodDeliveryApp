import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Pages/Home/Home'
import Cart from './Components/Pages/Cart/Cart'
import PlaceOrder from './Components/Pages/PlaceOrder/PlaceOrder'
import Login from './Components/Pages/Login/Login'
import Register from './Components/Pages/Register/Register'
import FoodDisplay from './Components/FoodDisplay/FoodDisplay'
// import FoodItems from "./Components/FoodItems/FoodItems";

const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/menu' element={<FoodDisplay/>}/>
        {/* <Route path='/foodItem' element={<FoodItems/>}/> */}

      </Routes>
    </div>
  )
}

export default App
