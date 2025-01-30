import { useState, useEffect } from "react";

// Fetch conversations from the API
const fetchConversations = async (token) => {
  try {
    const response = await fetch("http://localhost:8000/api/conversations/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
};

// Create a new conversation if one doesn't exist
const createConversation = async (token) => {
  try {
    const response = await fetch("http://localhost:8000/api/conversations/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating conversation:", error);
  }
};

// Send message to the API
const sendMessage = async (conversationId, message, token) => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/conversations/${conversationId}/send_message/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const Chatbot = () => {
  const [conversations, setConversations] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const loadConversations = async () => {
      if (!token) return;

      // Fetch existing conversations
      const data = await fetchConversations(token);
      if (data && data.length > 0) {
        setConversations(data);
        setConversationId(data[0].id); // Set the first conversation by default
      } else {
        // If no conversations exist, create a new one
        const newConversation = await createConversation(token);
        setConversations([newConversation]);
        setConversationId(newConversation.id); // Set the new conversation
      }
    };
    loadConversations();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return; // Prevent sending empty messages

    // Send the message to the backend
    const newMessage = await sendMessage(conversationId, currentMessage, token);
    setConversations((prevConversations) => [
      ...prevConversations,
      newMessage, // Append the new message
    ]);
    setCurrentMessage(""); // Clear the input field
  };

  return (
    <div>
      <h2>Chatbot</h2>
      <div>
        {conversations.length === 0 ? (
          <p>No conversations available</p>
        ) : (
          <div>
            <h3>Conversation ID: {conversationId}</h3>
            <div>
              {conversations.map((msg, index) => (
                <div key={index}>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input for sending messages */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
