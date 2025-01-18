import React from "react";
import VoiceInput from "../components/VoiceToText";
import HeatMap from "../components/Heatmap";
import HeatMap2 from "../components/Heatmap2";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
     <VoiceInput/>
     <HeatMap/>
     <div style={{marginTop: "20px"}}>
      {/* <HeatMap2/>  Work under progress */}
     </div>
    </div>
  );
};

export default Home;
