import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error("Failed to fetch user details");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUser(null);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!user) {
    return <div className="text-center text-blue-500 font-bold mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          User Profile
        </h1>
        <p className="text-gray-800"><strong>First Name:</strong> {user.first_name}</p>
        <p className="text-gray-800"><strong>Last Name:</strong> {user.last_name}</p>
        <p className="text-gray-800"><strong>Email:</strong> {user.email}</p>
        <p className="text-gray-800"><strong>Phone:</strong> {user.phone_number}</p>
        <p className="text-gray-800"><strong>Address:</strong> {user.address}</p>
        <p className="text-gray-800"><strong>Aadhar Number:</strong> {user.aadhar_number}</p>
        <p className="text-gray-800"><strong>Emergency Contact 1:</strong> {user.emergency_contact1}</p>
        <p className="text-gray-800"><strong>Emergency Contact 2:</strong> {user.emergency_contact2}</p>
        <p className="text-gray-800"><strong>Date Joined:</strong> {user.date_joined}</p>

        <button
          className="w-full mt-5 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
