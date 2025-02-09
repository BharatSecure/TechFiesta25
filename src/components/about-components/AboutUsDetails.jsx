import React from "react";


import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const AboutUsDetails = () => {
  return (
    <div className="p-12 bg-slate-900 min-h-screen">
    <div className="p-8 bg-slate-800 shadow-[inset_-12px_-12px_24px_#1e293b,inset_12px_12px_24px_#0f172a] rounded-xl">
      <h1 className="text-4xl font-bold mb-8 text-cyan-400 font-['Smooch_Sans'] drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
        About BharatSecure
      </h1>
      
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <p className="mb-8">
          Welcome to BharatSecure, your trusted partner in transforming the way
          incidents are reported and managed. Our mission is simple: to provide
          a platform that's not only easy to use but also highly effective in
          ensuring every voice is heard and every incident is addressed
          promptly. At BharatSecure, we understand that in times of distress,
          quick and efficient communication can make all the difference. Our
          platform is designed to bridge the gap between individuals and
          authorities, ensuring that every report is taken seriously and acted
          upon swiftly. Whether you're reporting an issue via text or voice, our
          system guarantees that your concerns are delivered directly to the
          relevant responders in real time. We believe that safety is a
          fundamental right, and our goal is to empower communities by offering
          a transparent, accessible, and inclusive reporting tool. By leveraging
          the latest technology, we aim to create a secure environment where
          everyone feels confident and supported in taking action. Our
          commitment to innovation drives us to continuously enhance our
          platform, ensuring that it remains at the forefront of incident
          reporting and management. Join us on this journey to build safer, more
          resilient communities—one report at a time. Together, we can make a
          meaningful difference and ensure that no voice goes unheard.
        </p>

        <div className="space-y-8">
          <div className="p-6 bg-slate-800 shadow-[inset_-8px_-8px_16px_#1e293b,inset_8px_8px_16px_#0f172a] rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400 font-['Smooch_Sans'] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Our Mission
            </h2>
            <p>
              At BharatSecure, we believe in creating a secure and responsive
              environment for everyone. Our platform bridges the gap between
              individuals and authorities, fostering trust and promoting swift
              action when it matters most.
            </p>
          </div>

          <div className="p-6 bg-slate-800 shadow-[inset_-8px_-8px_16px_#1e293b,inset_8px_8px_16px_#0f172a] rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400 font-['Smooch_Sans'] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Core Features
            </h2>
            <p className="mb-4">Here's what makes BharatSecure stand out:</p>
            <ul className="space-y-3">
              <li className="flex items-center">🚨 Real-time alerts and notifications for quick responses.</li>
              <li className="flex items-center">📊 Heatmap analytics to visualize incident trends.</li>
              <li className="flex items-center">🔍 End-to-end tracking for transparency and accountability.</li>
              <li className="flex items-center">📂 Categorization and filtering for efficient management.</li>
              <li className="flex items-center">📞 Emergency contact alerts for timely assistance.</li>
            </ul>
          </div>

          <div className="p-6 bg-slate-800 shadow-[inset_-8px_-8px_16px_#1e293b,inset_8px_8px_16px_#0f172a] rounded-xl">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400 font-['Smooch_Sans'] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              Future Goals
            </h2>
            <p className="mb-4">Looking ahead, we're excited about what the future holds:</p>
            <ul className="space-y-3">
              <li className="flex items-center">💡 Advanced analytics and AI insights to anticipate potential incidents.</li>
              <li className="flex items-center">🎨 Intuitive interfaces and personalized features to enhance user experience.</li>
              <li className="flex items-center">🤝 Expanding collaborations with more communities and organizations.</li>
              <li className="flex items-center">📚 Educational resources to promote awareness and preparedness.</li>
            </ul>
          </div>
        </div>

        <p className="mt-6">
          Together, let's build a safer and more connected world. Join us on
          this journey to make a meaningful impact and ensure everyone feels
          secure and empowered.
        </p>
      </div>
    </div>
  </div>
  );
};

export default AboutUsDetails;
