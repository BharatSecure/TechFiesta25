import { useState } from "react";

const FAQSection = () => {
  const [open, setOpen] = useState(null);

  const toggleOpen = (index) => {
    setOpen(open === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I report an incident?",
      answer:
        "To report an incident, simply click the 'Report Incident' button on the homepage, fill out the form with the necessary details, and submit it. Our system will handle the rest.",
    },
    {
      question: "What kind of incidents can I report?",
      answer:
        "You can report various incidents such as accidents, natural disasters, health emergencies, road hazards, and more. Just provide accurate details so authorities can respond quickly.",
    },
    {
      question: "How will I know if my report has been resolved?",
      answer:
        "Once your incident is resolved, you'll receive a notification indicating its resolution status. You can also track it through your dashboard.",
    },
    {
      question: "Can I report incidents anonymously?",
      answer:
        "Yes, you can choose to report incidents anonymously. However, providing your contact details may help authorities respond more effectively.",
    },
    {
      question: "What happens after I submit a report?",
      answer:
        "After you submit your report, the incident will be reviewed by local authorities. You'll be updated on the status of your report in real time.",
    },
  ];

  return (
    <div className="faq-section py-12 bg-gradient-to-r from-indigo-100 via-sky-200 to-blue-300">
      <h2 className="text-sky-600 font-extrabold text-5xl lg:text-6xl tracking-wide mt-7 text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="max-w-4xl mx-auto px-4">
        {faqData.map((item, index) => (
          <div key={index} className="mb-6">
            <button
              onClick={() => toggleOpen(index)}
              className="w-full text-left px-8 py-4 bg-white border border-gray-300 rounded-xl shadow-lg hover:bg-sky-50 transition-all duration-300 focus:outline-none"
            >
              <span className="text-xl font-medium text-gray-800">
                {item.question}
              </span>
            </button>
            {open === index && (
              <div className="px-8 py-5 bg-white border border-t-0 border-gray-300 rounded-b-xl shadow-md mt-4">
                <p className="text-gray-700">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
