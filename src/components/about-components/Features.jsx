import React, { forwardRef } from "react";

import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CssBaseline,
} from "@mui/material";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FadeInComponent from "@/lib/FadeInComponent";

// Custom theme with Ubuntu font
const theme = createTheme({
  typography: {
    fontFamily: "Ubuntu, sans-serif", // Set Ubuntu as the default font family
    h3: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#333", // Darker for better contrast
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      color: "#444", // Slightly darker for better readability
    },
    body1: {
      color: "#555", // Slightly lighter text for body content
      fontSize: "1rem",
    },
  },
});

const features = [
  {
    id: 1,
    title: "Incident Reporting",
    description:
      "Our Incident Reporting feature is designed to provide users with a seamless and efficient way to report various incidents, ensuring a comprehensive capture of all necessary details. Users can submit reports through multiple input methods, including text descriptions and image uploads, catering to different situations and preferences. The system intelligently processes the received information, automatically extracting key details such as location, time, and nature of the incident. This information is then systematically categorized and forwarded to the appropriate authorities or emergency services. By integrating real-time data collection and analysis, the feature not only speeds up the reporting process but also ensures that the response teams are well-informed and prepared to handle the incident promptly and effectively. Additionally, the platform offers users the ability to track the status of their reports, providing transparency and reassurance that their concerns are being addressed.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2017/10/17/14/10/financial-2860753_640.jpg",
    linkTo: "/report-incident",
  },
  {
    id: 2,
    title: "Saathi AI",
    description:
      "Saathi AI is your trusted AI-powered companion, dedicated to providing real-time support for medical emergencies, safety concerns, emotional well-being, and legal guidance. Designed to be a safe space, Saathi AI encourages women and children to speak up without fear, ensuring they receive the right help at the right time. Whether you need immediate assistance, mental health support, or legal advice, Saathi AI listens, understands, and guides you with empathy and accuracy. In times of uncertainty, you're never alone—Saathi AI is here to support, empower, and protect you.",
    imageUrl:
      "https://botnation.ai/site/wp-content/uploads/2022/02/meilleur-chatbot.jpg",
    linkTo: "/chatbot",
  },
  {
    id: 3,
    title: "Heatmaps",
    description:
      "Our Heatmap feature is a powerful visualization tool that dynamically represents data, providing users with an intuitive and interactive way to understand incident trends and safety levels across various locations. By aggregating real-time data from reported incidents, the Heatmap displays these events geographically, using color gradients to indicate the density and frequency of occurrences. Areas with higher concentrations of incidents are highlighted in warmer colors (such as red or orange), while areas with fewer reports appear in cooler tones (like green or blue).This visual representation allows users to quickly identify hotspots of activity, assess the relative safety of different regions, and make informed decisions based on current data. For authorities and emergency responders, the Heatmap serves as a critical tool for situational awareness, enabling them to prioritize resources and respond more efficiently to areas with higher incident rates.The feature is interactive, allowing users to zoom in and out, filter data by specific time frames or types of incidents, and click on specific locations to view detailed reports. This functionality not only enhances user engagement but also empowers individuals and organizations to proactively address safety concerns, improving community well-being and responsiveness",
    imageUrl: "../heatmap.png",
    linkTo: "/heatmap",
  },
  {
    id: 4,
    title: "Voice Report",
    description:
      "The Voice Report feature allows users to report incidents hands-free using voice commands, making it ideal for situations where typing isn't possible, such as during emergencies or when the user is physically unable to type. By utilizing advanced voice recognition, the system captures and transcribes spoken details like the nature of the incident and location. This information is then forwarded to the appropriate authorities. The feature enhances accessibility, speeds up reporting, and can be used with smart devices for added convenience.",
    imageUrl:
      "https://cdn.pixabay.com/photo/2021/03/27/08/49/mic-6127818_640.jpg",
    linkTo: "/voice-report",
  },
];

const Features = forwardRef((props, ref) => {
  return (
   <div ref={ref} className="min-h-screen bg-slate-900 py-12 px-4 overflow-hidden">
  <h1 className="text-4xl font-bold text-center mb-8 text-cyan-400 font-['Smooch_Sans'] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
    Our Features
  </h1>

  <div className="space-y-12">
    {features.map((feature, index) => (
      <div
        key={feature.id}
        className={`flex flex-col sm:${
          index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
        } items-center gap-4 transition-transform duration-300 hover:scale-102`}
      >
        <div className="w-full">
          <a href={feature.linkTo} className="w-full no-underline block">
            <div className="flex flex-col sm:flex-row bg-slate-800 rounded-xl shadow-[inset_-12px_-12px_24px_#1e293b,inset_12px_12px_24px_#0f172a] overflow-hidden transition-all duration-300 hover:scale-95 
              hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              <div className="w-full sm:w-4/5 min-h-[300px] sm:min-h-[400px] relative">
                <img
                  src={feature.imageUrl}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                />
              </div>

              <div className="flex flex-col justify-center p-6 sm:p-8 bg-slate-800 rounded-b-xl sm:rounded-r-xl sm:rounded-bl-none flex-grow">
                <h2 className="text-2xl font-bold mb-4 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                  {feature.title}
                </h2>
                <p className="text-gray-300 mb-6">
                  {feature.description}
                </p>
                <button
                  className="mt-3 w-full sm:w-1/2 self-center rounded-xl bg-cyan-900 py-3 px-6 text-cyan-100 text-sm font-semibold 
                  shadow-[inset_-4px_-4px_8px_#164e63,inset_4px_4px_8px_#083344] 
                  hover:shadow-[inset_-6px_-6px_12px_#164e63,inset_6px_6px_12px_#083344] 
                  hover:bg-cyan-800
                  transition-all duration-300"
                  type="button"
                >
                  Try Now
                </button>
              </div>
            </div>
          </a>
        </div>
      </div>
    ))}
  </div>
</div>

  
  );
});

export default Features;
