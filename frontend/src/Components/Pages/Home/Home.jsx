import React, { useContext, useState } from "react";
import "./Home.css";
import Header from "../../Header/Header";
import ExploreMenu from "../../ExploreMenu/ExploreMenu";
import { useSearchParams } from "react-router-dom";
// import FoodItems from '../../FoodItems/FoodItems'
import FoodDisplay from "../../FoodDisplay/FoodDisplay";
import { StoreContext } from "../../../context/StoreContext";

const Home = () => {
  const [category, setCategory] = useState("All");

  const {setLogin}=useContext(StoreContext)

  async function verify(token) {
    console.log(token);
    const req = await fetch("http://localhost:8000/user/verify", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });
    const data = await req.json();
    if (data.status == "failed") {
      localStorage.removeItem("token");
      window.location.href = "http://localhost:3000/login";
    } else {
      console.log("hello");
      setLogin((login)=>!login)
    }
  }

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   // console.log(token)
  //   if (token != null) {
  //     verify(token);
  //   } else {
  //     window.location.href = "http://localhost:8000/login";
  //   }
  // });

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
};

export default Home;
