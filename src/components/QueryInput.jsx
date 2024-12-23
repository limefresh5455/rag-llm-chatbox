import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Send } from "lucide-react";
import FileUpload from "./FileUpload";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";

const QueryInput = ({
  query,
  setQuery,
  handleQuery,
  loading,
  file,
  handleFileChange,
  fileInputRef,
  showFileUpload,
  setFileName,
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleSpeechInput = async () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      console.error("Microphone permission error:", error);
      alert(
        "Microphone access is required for speech-to-text. Please check your browser settings and permissions."
      );
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setQuery((prevQuery) => `${prevQuery} ${transcript}`.trim());
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended...");
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);

        const errorMessages = {
          "no-speech": "No speech detected. Please try speaking again.",
          "audio-capture": "Microphone not found or not accessible.",
          "not-allowed":
            "Microphone access denied. Please check browser permissions.",
        };

        alert(
          errorMessages[event.error] ||
            "An unknown error occurred. Please try again."
        );
      };
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="relative flex w-full items-center bg-[#2f2f2f] rounded-2xl text-white focus-within:ring-2 focus-within:ring-[#212121]">
      {showFileUpload && (
        <FileUpload
          handleFileChange={handleFileChange}
          fileInputRef={fileInputRef}
          setFileName={setFileName}
        />
      )}

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a question"
        className="p-4 bg-transparent text-white placeholder-gray-500 focus:outline-none scrollBar flex-1 border-[#676767] scrollbar scrollbar-thumb-[#676767] scrollbar-track-transparent resize-none"
        style={{
          height: query ? "auto" : "50px",
          minHeight: "50px",
          overflowY: query ? "auto" : "hidden",
          paddingTop: "15px",
          paddingBottom: "15px",
          lineHeight: "20px",
        }}
        disabled={loading}
        onInput={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      <button
        onClick={handleSpeechInput}
        className="p-4 text-white hover:text-gray-400"
        title={isListening ? "Stop Listening" : "Start Listening"}
      >
        {isListening ? (
          <FaMicrophoneSlash className="w-6 h-6 text-red-500" />
        ) : (
          <FaMicrophone className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={handleQuery}
        disabled={loading || (!query && !file)}
        className="p-4 text-white hover:text-gray-400 disabled:opacity-50"
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="w-6 h-6 animate-spin" />
        ) : (
          <Send className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

QueryInput.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  handleQuery: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  file: PropTypes.object,
  handleFileChange: PropTypes.func.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  showFileUpload: PropTypes.bool.isRequired,
  setFileName: PropTypes.func.isRequired,
};

export default QueryInput;
