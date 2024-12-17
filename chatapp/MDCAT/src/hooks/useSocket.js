// useSocket.js
import { useState, useEffect, useRef, useCallback } from "react";
import client from "../utils/api/client";
import { PYTHON } from "@env";

const useSocket = (chatId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);
  const socket = useRef(null);

  const getWebSocketUrl = () => {
    const host = PYTHON;
    return `${host}/ws/${chatId}`;
  };

  useEffect(() => {
    const connectWebSocket = () => {
      const wsUrl = `${getWebSocketUrl()}`;
      console.log(`Connecting to WebSocket at ${wsUrl}`);

      socket.current.onopen = () => {
        console.log("Successfully connected to server");
        setIsConnected(true);
        setError(null);

        fetchChatHistory();
      };

      socket.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        setIsConnected(false);
        setError("Connection error occurred");
        setIsWaitingForReply(false);
      };

      socket.current.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
        setIsWaitingForReply(false);

        // Attempt to reconnect after a delay
        setTimeout(() => {
          console.log("Attempting to reconnect...");
          connectWebSocket();
        }, 3000);
      };

      socket.current.onmassage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received message:", data);

          switch (data.type) {
            case "processing":
              console.log("Bot is processing message");
              break;

            case "answer":
              // Save bot response to database
              try {
                await client.post("/chat/message", {
                  chatId,
                  sender: "bot",
                  content: data.answer.trim(),
                });

                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    sender: "bot",
                    content: data.answer.trim(),
                    timestamp: new Date().toISOString(),
                  },
                ]);
              } catch (error) {
                console.error("Error saving bot message:", error);
                setError("Failed to save bot response");
              }
              setIsWaitingForReply(false);
              break;

            case "error":
              setError(data.message);
              console.error(data.message);
              setIsWaitingForReply(false);
              break;

            default:
              console.warn("Unknown message type:", data.type);
          }
        } catch (err) {
          console.error("Error parsing message:", err);
          setError("Error processing server response");
          setIsWaitingForReply(false);
        }
      };
    };

    if (chatId) {
      connectWebSocket();
    }

    return () => {
      if (socket.current) {
        socket.current.close();
      }
    };
  }, [chatId]);

  const fetchChatHistory = async () => {
    try {
      const response = await client.get(`/chat/${chatId}/messages`);
      setMessages(response.data.data.messages);
      console.log(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setError("Failed to load chat history");
    }
  };

  const sendMessage = useCallback(
    async (content) => {
      if (socket.current?.readyState === WebSocket.OPEN && !isWaitingForReply) {
        try {
          // First save the user message to the database
          const response = await client.post("/chat/message", {
            chatId,
            sender: "user",
            content: content.trim(),
          });

          // Add the message to the local state
          setMessages((prevMessages) => [...prevMessages, response.data.data]);

          // Prepare the last 10 messages
          const lastTenMessages = messages.slice(-10);
          // Send message through WebSocket
          const payload = JSON.stringify({
            chatId,
            question: content.trim(),
            chatHistory: lastTenMessages,
          });

          socket.current.send(payload);
          setIsWaitingForReply(true);
          setError(null);
        } catch (err) {
          console.error("Error sending message:", err);
          setError("Failed to send message");
        }
      } else if (!isConnected) {
        setError("Not connected to server");
      }
    },
    [chatId, isWaitingForReply, isConnected, messages]
  );

  const refreshChat = useCallback(() => {
    setMessages([]);
    setIsWaitingForReply(false);
    setError(null);
    fetchChatHistory();

    if (socket.current) {
      socket.current.close();
      const wsUrl = getWebSocketUrl();
      socket.current = new WebSocket(`${wsUrl}?chatId=${chatId}`);
    }
  }, [chatId]);

  return {
    sendMessage,
    isConnected,
    error,
    messages,
    isWaitingForReply,
    refreshChat,
  };
};

export default useSocket;
