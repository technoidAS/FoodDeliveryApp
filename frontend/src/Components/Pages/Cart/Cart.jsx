import React, { useContext,useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import { StoreContext } from "../../../context/StoreContext";
const Cart = () => {
  const isCartEmpty = false;
  const { food_list, cartItems, removeFromCart,setCartItems } = useContext(StoreContext);
 
  return (
    <div>
      {isCartEmpty ? (
        <div className="mx-auto max-w-7xl px-5 bg-white lg:px-0">
          <div className="mx-auto max-w-xl md:max-w-2xl py-8 px-6 md:px-2 lg:max-w-3xl">
            <h1 className="text-3xl  text-center font-serif tracking-tight text-gray-900 md:text-5xl">
              Shopping Cart
            </h1>
            <div className="flex justify-center items-center mt-12">
              <div className="flex flex-col items-center">
                <div>
                  <img
                    src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                    alt="empty cart"
                    className="h-52 w-52"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Your cart is empty
                  </h2>
                </div>
                <div className=" ">
                  <p className="text-gray-500 text-center mt-2 mb-6">
                    {" "}
                    Looks like you haven't added any items to the cart yet
                  </p>
                </div>
                <Link
                  to="/"
                  className="block px-3 py-3 bg-black text-white font-semibold text-sm text-center mt-5 rounded-md shadow-sm hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="cart">
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />
            <hr />

            {food_list.map((item, index) => {
              if (cartItems[item._id] > 0) {
                return (
                  <>
                    <div className="cart-items-title cart-items-item">
                    <img src={item.image} alt="" />
                    <p>{item.name}</p>
                    <p>{item.price}</p>
                    <p>{cartItems[item._id]}</p>
                    <p>{item.price * cartItems[item._id]}</p>
                    <p>X</p>
                    
                  </div>
                  <br />
                  <hr />
                  </>
                  
                  
                );
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
