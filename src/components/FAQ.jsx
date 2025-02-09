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
    <div className="py-12 bg-[#001a2f]">
      <h2 className="text-[#00ffff] font-extrabold text-4xl lg:text-6xl tracking-wide mt-7 text-center mb-8 [text-shadow:_0_0_15px_rgba(0,255,255,0.5)] hover:[text-shadow:_0_0_20px_rgba(0,255,255,0.8)] transition-all duration-300">
        Frequently Asked Questions
      </h2>
      <div className="max-w-4xl mx-auto px-4">
        {faqData.map((item, index) => (
          <div key={index} className="mb-6">
            <button
              onClick={() => toggleOpen(index)}
              className="w-full text-left px-8 py-4 bg-[#002240] text-[#00ffff] border border-[#003366] rounded-xl shadow-[8px_8px_16px_#001527,_-8px_-8px_16px_#002f59] hover:shadow-[12px_12px_24px_#001527,_-12px_-12px_24px_#002f59,_0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300 focus:outline-none hover:-translate-y-1"
            >
              <span className="text-base font-medium lg:text-lg">
                {item.question}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                open === index ? "max-h-40" : "max-h-0"
              }`}
            >
              <div className="px-8 py-5 bg-[#002240] text-[#80ffff] border border-t-0 border-[#003366] rounded-b-xl shadow-[inset_8px_8px_16px_#001527,_inset_-8px_-8px_16px_#002f59]">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
