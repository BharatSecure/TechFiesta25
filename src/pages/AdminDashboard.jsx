import React, { useState, useEffect } from "react";
import { MdReportProblem, MdCheckCircle, MdHourglassEmpty, MdChat } from "react-icons/md";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";


const AdminDashboard = () => {

 const [total, setTotal] = useState();
  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnResolved] = useState(0);

const [filter ,setFilter]=useState('All')

const [filternew , setFilterNew]=useState([])

  const [incidents, setIncidents] = useState([
    {
      id: 3319,
      user: "John Doe",
      title: "Broken Streetlight",
      description: "A streetlight is broken near the park.",
      severity: "Medium",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Resolved",
    },
    {
      id: 1269,
      user: "Jane Smith",
      title: "Pothole on Road",
      description: "A big pothole on the main road.",
      severity: "High",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Under Process",
    },
    {
      id: 1012,
      user: "Michael Johnson",
      title: "Flooding in Basement",
      description: "Water leakage in the building basement.",
      severity: "Low",
      location: "Latitude: 19.185664, Longitude: 72.8367104",
      status: "Under Process",
    },
    {
      id: 4321,
      user: "Alice Cooper",
      title: "Leaking Water Pipe",
      description: "A water pipe is leaking in the neighborhood.",
      severity: "Low",
      location: "Latitude: 19.0825223, Longitude: 72.7411012",
      status: "Under Process",
    },
    {
      id: 5478,
      user: "Bob Taylor",
      title: "Collapsed Tree",
      description: "A tree has fallen on the sidewalk.",
      severity: "Medium",
      location: "Latitude: 19.2057984, Longitude: 72.8397031",
      status: "Under Process",
    },
    
  
  ]);

  const getSeverityColor = (severity) => {
    if (severity === "Low") return "text-blue-700 border-blue-600 bg-blue-200";
    if (severity === "Medium") return "text-yellow-700 border-yellow-600 bg-yellow-200";
    if (severity === "High") return "text-red-700 border-red-600 bg-red-200";
  };

  const handleMarkAsCompleted = (id) => {
    setIncidents((prevIncidents) =>
      prevIncidents.map((incident) =>
        incident.id === id
          ? { ...incident, status: "Resolved", severity: "Resolved" }
          : incident
      )
    );
  };

 const { logout } = useAuth();



  const handleLogout = () => {
    window.location.href = "/";
    logout();
  };



 useEffect(() => {
    let totalIncidents = 0;
    let resolvedIncidents = 0;
    let unresolvedIncidents = 0;

    incidents.forEach((inci) => {
      
      totalIncidents++;
      if (inci.status === "Resolved") {
        resolvedIncidents++;
      } else {
        unresolvedIncidents++;
      }
    });

    setTotal(totalIncidents);
    setResolved(resolvedIncidents);
    setUnResolved(unresolvedIncidents);
  }, [incidents]);




const handlefilter=(e)=>{
  
  
  setFilter(e)
  

}

useEffect(() => {
  
  const filteredIncidents = incidents.filter((incidentfilt) => {
    if (filter === "All") {
      return incidentfilt; 
    }
    return incidentfilt.severity === filter; 
  });

  setFilterNew(filteredIncidents)
}, [filter, incidents]);




  return (
    <>




    
<div className="h-full bg-gradient-to-r from-green-100 to-green-200">
  {/* Main content */}
  <div className="flex-grow p-8 pb-24  ">
    {/* Header */}
    <header className="mb-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800">
        <span className="text-emerald-600">Admin Dashboard</span>
      </h1>
    </header>

    <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            style={{ float: "right", position: "relative", top: "-50px" }}
          >
            Logout
          </button>


    {/* Dashboard Stats Cards */}
    <div className="flex flex-row gap-6 mb-6 justify-center mt-16 ml-8">
      {/* Total Incidents Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-evenly w-80 border-4 border-red-500 cursor-pointer">
        <div>
          <h3 className="text-xl font-semibold text-gray-700">
            Total Incidents
          </h3>
          <p className="text-3xl font-bold text-gray-900">{total}</p>
        </div>
        <MdReportProblem className="text-red-500 mr-2 text-6xl" />
      </div>

      {/* Resolved Incidents Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-evenly w-80 border-4 border-green-500 cursor-pointer">
        <div>
          <h3 className="text-xl font-semibold text-gray-700">
            Resolved Incidents
          </h3>
          <p className="text-3xl font-bold text-gray-900">{resolved}</p>
        </div>
        <MdCheckCircle className="text-green-500 mr-2 text-6xl" />
      </div>

      {/* Unresolved Incidents Card */}
      <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-evenly w-80 border-4 border-yellow-500 cursor-pointer">
        <div>
          <h3 className="text-xl font-semibold text-gray-700">
            Unresolved Incidents
          </h3>
          <p className="text-3xl font-bold text-gray-900">{unresolved}</p>
        </div>
        <MdHourglassEmpty className="text-yellow-500 mr-2 text-6xl" />
      </div>
    </div>

    <form className="mb-6 flex flex-row items-center justify-start gap-4 space-y-2">
  <label
    htmlFor="cars"
    className="text-lg font-semibold text-gray-800 mb-2"
  >
    Filter by Severity:
  </label>
  <select
    name="cars"
    id="cars"
    className="cursor-pointer w-64 p-3 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:shadow-md transition-all"
    value={filter}
    onChange={(event) => handlefilter(event.target.value)}
  >
    <option value="All">All</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>
</form>

    



    {/* Incidents Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 from-green-100 to-green-200 ">
      {filternew.map((incident) => (
        <div
          key={incident.id}
          className={`p-6 rounded-lg shadow-lg border-2 border-black ${getSeverityColor(
            incident.severity
          )}`}
        >
          <div className="flex justify-between items-center mb-4">
            <span
              className={`px-3 py-1 rounded border font-bold text-lg ${getSeverityColor(
                incident.severity
              )}`}
            >
              {incident.severity}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{incident.title}</h3>
            <p className="text-gray-800 font-bold text-xl">ID: {incident.id}</p>
          </div>
          <p className="text-gray-600 text-sm mb-2">{incident.description}</p>
          <p className="text-gray-600 text-sm mb-2">Reported By: {incident.user}</p>
          <p className="text-gray-600 text-sm mb-4">{incident.location}</p>
          <div className="flex gap-4 items-center">
            <Popover>
                                  <PopoverTrigger>
                                    <MdChat
                                      title="Contact Authorities"
                                      className="text-black cursor-pointer hover:text-black hover:scale-105 transition-transform text-3xl"
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    <div className="p-4 bg-white w-full h-full">
                                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                                        Chat with {incident.user}
                                      </h3>
                                      <p className="text-gray-600 mb-4">
                                        Start a conversation with {incident.user} to discuss
                                        this incident. Provide updates or ask for guidance
                                        in real-time.
                                      </p>
                                      <div className="flex justify-end gap-2">
                                        <button className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition">
                                          Start Chat
                                        </button>
                                      </div>
                                    </div>
                                  </PopoverContent>
                                </Popover>
            {incident.status !== "Resolved" && (
              <button
                onClick={() => handleMarkAsCompleted(incident.id)}
                className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
              >
                Mark as Completed
              </button>
            )}
            {incident.status === "Resolved" && (
              <span className="text-green-700 font-bold border border-green-500 px-2 py-1 rounded">
                Completed
              </span>
            )}
             
             



          </div>
          <button className="bg-gray-800 hover:bg-gray-950 text-white px-4 py-2 rounded-lg mt-4 relative bottom-0 right-0 w-full">View Details</button>
        </div>
      ))}
    </div>
  </div>

  {/* Footer */}
  <Footer />
</div>



     
    </>
  );
};

export default AdminDashboard;
