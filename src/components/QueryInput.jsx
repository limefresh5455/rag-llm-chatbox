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

  const handleSpeechInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Allow continuous speech recognition
      recognitionRef.current.interimResults = true; // Allow interim results (partial transcription)
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started...");
      };

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        // Iterate over each result and get the transcript
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          transcript += result[0].transcript;
        }

        // Log the transcript and whether it's final or interim
        console.log("Transcript:", transcript);
        console.log("Is Final:", event.results[event.resultIndex].isFinal);

        // Update the query with the new speech-to-text result
        setQuery((prevQuery) => `${prevQuery}${transcript}`);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log("Speech recognition ended...");
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          console.log("No speech detected. Try speaking again.");
        } else if (event.error === "audio-capture") {
          console.log("Audio capture error. Please check your microphone.");
        } else if (event.error === "not-allowed") {
          console.log(
            "Microphone access is not allowed. Please check your permissions."
          );
        } else {
          console.log("Unknown error:", event.error);
        }
      };
    }

    // Toggle listening state based on current state
    if (isListening) {
      recognitionRef.current.stop(); // Stop listening if already active
      setIsListening(false);
    } else {
      recognitionRef.current.start(); // Start listening when triggered
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
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleQuery();
          }
        }}
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
