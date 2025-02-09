import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Arjun",
      role: "Civil Engineer",
      testimonial:
        "The incident reporting system made it incredibly easy to report accidents and health emergencies. The response time was fast, and the authorities acted immediately!",
      image: "https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&fl=progressive&q=70&fm=jpg", // Using placeholder since external images aren't allowed
    },
    {
      name: "Priya",
      role: "Teacher",
      testimonial:
        "I love how easy it was to report a road hazard using the system. It's user-friendly, and I felt that my report was handled with urgency and care.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsynwv-5qtogtOwJbIjaPFJUmHpzhxgqIAug&s",
    },
    {
      name: "Aryan",
      role: "Firefighter",
      testimonial:
        "As a first responder, I appreciate how quickly incidents are reported and tracked. This platform has definitely improved communication with the community.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC8kiSH5ZSAcVoj3tAQQDoP_ux0sSricMyUg&s",
    },
  ];

  return (
    <div className="bg-slate-900 py-16 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            What Our Users Say
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Real experiences from people who have used our system to report
            incidents and receive help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-6 shadow-[inset_-8px_-8px_12px_rgba(0,0,0,0.3),inset_8px_8px_12px_rgba(255,255,255,0.1)] 
                         hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 
                         transform hover:scale-105 group"
            >
              <div className="flex items-center mb-6">
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-full bg-slate-700 
                                shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1)]
                                group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all duration-300"
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover opacity-80"
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-slate-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="relative">
                <p className="text-slate-300 italic relative z-10">
                  {testimonial.testimonial}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
