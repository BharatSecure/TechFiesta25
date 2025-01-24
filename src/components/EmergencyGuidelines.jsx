import React from "react";

const EmergencyGuidelines = () => {
  return (
    <div className="bg-blue-50 py-10 px-6">
      <h2 className="text-center text-4xl font-bold text-sky-600 mb-6">
        Emergency Guidelines & Resources
      </h2>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Local Emergency Services
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="tel:911" className="text-sky-600 hover:underline">
                Call 911 (Emergency Services)
              </a>
            </li>
            <li>
              <a href="tel:8005551234" className="text-sky-600 hover:underline">
                National Emergency Helpline
              </a>
            </li>
            <li>
              <a
                href="https://www.redcross.org/prepare/disaster-safety.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-600 hover:underline"
              >
                Red Cross Disaster Safety Guidelines
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Reporting Guidelines
          </h3>
          <ul className="space-y-2">
            <li>
              <p className="text-gray-700">
                Ensure that you provide accurate and detailed information when
                reporting an incident. This includes the type of incident,
                location, number of people involved, and any immediate actions
                taken.
              </p>
            </li>
            <li>
              <p className="text-gray-700">
                If you are reporting a road hazard or emergency, include road
                numbers, nearby landmarks, or GPS coordinates to help responders
                locate the incident quickly.
              </p>
            </li>
            <li>
              <p className="text-gray-700">
                Use clear, concise language and avoid unnecessary details that
                could delay the response.
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Safety Tips
          </h3>
          <ul className="space-y-2">
            <li>
              <p className="text-gray-700">
                In case of a natural disaster, stay informed through local news
                and official alerts. Always follow evacuation instructions if
                necessary.
              </p>
            </li>
            <li>
              <p className="text-gray-700">
                Keep an emergency kit with essentials such as water, food,
                medications, flashlight, and first-aid supplies.
              </p>
            </li>
            <li>
              <p className="text-gray-700">
                If you're reporting an emergency, remain calm and try to help
                others who may need assistance. Your safety should always be the
                top priority.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmergencyGuidelines;
