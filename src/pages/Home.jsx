import React from "react";
import VoiceInput from "../components/VoiceToText";
import HeatMap from "../components/Heatmap";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
     <VoiceInput/>
     <HeatMap/>
    </div>
  );
};

export default Home;
