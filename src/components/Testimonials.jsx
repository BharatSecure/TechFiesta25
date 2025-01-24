const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      role: "Civil Engineer",
      testimonial:
        "The incident reporting system made it incredibly easy to report accidents and health emergencies. The response time was fast, and the authorities acted immediately!",
      image: "https://randomuser.me/api/portraits/men/1.jpg", // Placeholder image
    },
    {
      name: "Sarah Lee",
      role: "Teacher",
      testimonial:
        "I love how easy it was to report a road hazard using the system. It’s user-friendly, and I felt that my report was handled with urgency and care.",
      image: "https://randomuser.me/api/portraits/women/2.jpg", // Placeholder image
    },
    {
      name: "David Smith",
      role: "Firefighter",
      testimonial:
        "As a first responder, I appreciate how quickly incidents are reported and tracked. This platform has definitely improved communication with the community.",
      image: "https://randomuser.me/api/portraits/men/3.jpg", // Placeholder image
    },
  ];

  return (
    <div className="bg-gradient-to-r from-gray-100 to-gray-200 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-sky-600">What Our Users Say</h2>
        <p className="text-xl text-gray-700 mt-4">
          Real experiences from people who have used our system to report
          incidents and receive help.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="max-w-xs w-full bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition-all"
          >
            <div className="flex items-center mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full border-2 border-sky-500 mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-700 italic">{`"${testimonial.testimonial}"`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
