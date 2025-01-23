import { createContext, useState } from "react";

export const IncidentsContext = createContext();

export const IncidentsProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([
    {
      Name: "David Lee",
      IncidentID: "12347",
      IncidentType: "Vandalism",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      Description: "Graffiti was found on the school building",
      Severity: "Medium",
      Status: true,
      file: {
        name: "graffiti_report.pdf",
        type: "application/pdf",
        size: 123, 
      },
    },
    {
      Name: "David Lee",
      IncidentID: "12348",
      IncidentType: "Accident",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      Description: "Car accident occurred at the intersection",
      Severity: "High",
      Status: false,
      file: null
    },
    {
      Name: "David Lee",
      IncidentID: "12349",
      IncidentType: "Disturbance",
      Location:"Latitude: 19.185664, Longitude: 72.8367104",
      Description: "Loud noise complaint from neighbors",
      Severity: "Low",
      Status: false,
      file: {
        name: "noise_complaint.txt",
        type: "text/plain",
        size: 12, 
      },
    },
    {
      Name: "Emily Chen",
      IncidentID: "12350",
      IncidentType: "Fire",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      Description: "Small fire in the apartment building",
      Severity: "High",
      Status: true,
      file: {
        name: "fire_report.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 85, 
      },
    },
    {
      Name: "Emily Chen",
      IncidentID: "12351",
      IncidentType: "Medical Emergency",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      Description: "Person experiencing a heart attack",
      Severity: "High",
      Status: false,
      file: null
    },
    {
      Name: "Maria Garcia",
      IncidentID: "12352",
      IncidentType: "Suspicious Activity",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      Description: "Unidentified person loitering near the park",
      Severity: "Low",
      Status: true,
      file: {
        name: "activity_log.jpg",
        type: "image/jpeg",
        size: 102, 
      },
    },
    {
      Name: "Maria Garcia",
      IncidentID: "12353",
      IncidentType: "Animal Control",
      Location: "Latitude: 19.185664, Longitude: 72.8367104",
      Description: "Loose dog running in the street",
      Severity: "Medium",
      Status: false,
      file: {
        name: "dog_photo.png",
        type: "image/png",
        size: 67, 
      },
    },
  ]);

  return (
    <IncidentsContext.Provider value={{ incidents, setIncidents }}>
      {children}
    </IncidentsContext.Provider>
  );
};
