import { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState("test_session");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:8000/api/chat/", {
        user_input: input,
        session_id: sessionId,
      });

      const botMessage = { role: "bot", content: response.data.bot_response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput("");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border rounded shadow-lg bg-white">
      <h1 className="text-xl font-bold mb-4 text-center">Chat with AI</h1>
      <div className="h-64 overflow-y-auto border p-2 mb-4 bg-gray-100 rounded">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-1 rounded ${
              msg.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
