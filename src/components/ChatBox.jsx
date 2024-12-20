import { useState, useRef, useEffect } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import ModelSelector from "./ModelSelector";
import QueryInput from "./QueryInput";

function ChatBox() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState("OpenAI-GPT-4.0");
  const [selectedChatMode, setSelectedChatMode] = useState("document");
  const user_id = localStorage.getItem("user_id");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const [showScrollDown, setShowScrollDown] = useState(false);

  useEffect(() => {
    const savedMessages = sessionStorage.getItem("chatHistory");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    if (selectedChatMode === "document") {
      setSelectedModel("OpenAI-GPT-4.0-mini");
    } else {
      setSelectedModel("OpenAI-GPT-4.0-mini");
    }

    const clearSessionStorage = () => {
      sessionStorage.clear();
    };

    window.addEventListener("beforeunload", clearSessionStorage);

    return () => {
      window.removeEventListener("beforeunload", clearSessionStorage);
    };
  }, [selectedChatMode]);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    const isAtBottom =
      chatContainer.scrollHeight - chatContainer.scrollTop ===
      chatContainer.clientHeight;

    if (!isAtBottom) {
      setShowScrollDown(true);
    } else {
      setShowScrollDown(false);
    }
  };

  const handleScrollDown = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      try {
        setLoading(true);
        const uploadFormData = new FormData();
        uploadFormData.append("user_id", user_id);
        uploadFormData.append("file", selectedFile);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/upload`,
          uploadFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const successMessage =
          response.data.message || "File uploaded successfully!";

        alert(`${successMessage}`);

        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Error uploading file:", error);
        alert(
          "Error occurred while uploading the file. Please check the server or network connection."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuery = async () => {
    if (!query && !file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append("model", selectedModel);

      if (selectedChatMode === "document" && query) {
        formData.append("query", query);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/query`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const responseData = await response.json();

        if (responseData.response) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              type: "question",
              text: query,
              fileName: file ? file.name : "",
              chatMode: "document",
            },
            { type: "response", text: responseData.response },
          ]);
        }

        setQuery("");
      } else if (selectedChatMode === "dataset" && query) {
        formData.append("query", query);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/dataset_query`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const answer =
          response.data.response || "No response provided by the server.";

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "question",
            text: query,
            fileName: file ? file.name : "",
            chatMode: "dataset",
          },
        ]);

        setQuery("");

        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "answer", text: answer.replace(/\*\*/g, "") },
        ]);
      }
    } catch (error) {
      console.error("Error querying:", error);
      alert("No file uploaded. Please upload a file first.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#212121] text-gray-100">
      <main className="flex-1 flex flex-col p-8 pr-0 pt-2 pb-2">
        <div className="flex items-center mb-2 pr-8">
          <label htmlFor="chat-options" className="mr-2 text-lg text-[#b4b4b4]">
            Chat Mode:
          </label>
          <select
            id="chat-options"
            className="p-3 bg-[#212121] text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus-within:ring-[#212121] transition duration-200"
            value={selectedChatMode}
            onChange={(e) => setSelectedChatMode(e.target.value)}
          >
            <option value="document">Chat with Documents</option>
            <option value="dataset">Chat with Dataset</option>
          </select>
          <div className="ml-auto">
            <ModelSelector
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              selectedChatMode={selectedChatMode}
            />
          </div>
        </div>

        <div
          ref={chatContainerRef}
          className={`flex-1 border-[#676767] scrollbar scrollbar-thumb-[#676767] scrollbar-track-transparent ${
            messages.length === 0
              ? "overflow-hidden h-screen"
              : "overflow-y-auto"
          }`}
          onScroll={handleScroll}
        >
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-screen">
                <p className="text-4xl text-white text-center">
                  What can I help with?
                </p>
              </div>
            ) : (
              <MessageList
                messages={messages}
                handleCopy={handleCopy}
                showCopied={showCopied}
                fileName={fileName}
                selectedChatMode={selectedChatMode}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {showScrollDown && (
          <button
            onClick={handleScrollDown}
            className="absolute bottom-6 right-8 bg-[#171717] px-4 py-2 rounded-full text-white"
          >
            &#8595;
          </button>
        )}

        <div className="mt-auto">
          <div className="max-w-4xl mx-auto mt-2">
            <div className="flex items-center mb-2 mt-2">
              <QueryInput
                query={query}
                setQuery={setQuery}
                handleQuery={handleQuery}
                loading={loading}
                file={file}
                handleFileChange={handleFileChange}
                fileInputRef={fileInputRef}
                showFileUpload={selectedChatMode === "dataset"}
                setFileName={setFileName}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatBox;
