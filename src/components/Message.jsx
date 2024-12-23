import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { marked } from "marked";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { GoCopy } from "react-icons/go";
import PropTypes from "prop-types";
import { FileText } from "lucide-react";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";

const Message = ({
  message,
  showCopied,
  isMarkdown,
  fileName,
  selectedChatMode,
  copiedMessageId,
  setCopiedMessageId,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechInstance, setSpeechInstance] = useState(null);

  const speakText = (text) => {
    if (speechInstance) {
      window.speechSynthesis.cancel();
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1.5;
    speech.pitch = 1;
    speech.volume = 1;

    speech.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(speech);
    setSpeechInstance(speech);
    setIsSpeaking(true);
  };

  const stopSpeech = () => {
    if (speechInstance) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = (id, elementId) => {
    setCopiedMessageId(id);

    const contentElement = document.getElementById(elementId);

    if (contentElement) {
      const range = document.createRange();
      range.selectNodeContents(contentElement);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);

      navigator.clipboard
        .writeText(contentElement.innerText)
        .then(() => {
          setTimeout(() => {
            setCopiedMessageId(null);
          }, 2000);

          selection.removeAllRanges();
        })
        .catch((err) => {
          console.error("Error copying rendered content:", err);
        });
    } else {
      console.error("Content element not found!");
    }
  };

  return (
    <div
      className={`flex ${
        message.type === "question" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`p-3 m-2 rounded-2xl ${
          message.type === "question"
            ? "bg-[#2f2f2f] max-w-[60%] flex-shrink-0"
            : "bg-[#171717] max-w-full"
        }`}
        style={{
          overflowWrap: "break-word",
          wordWrap: "break-word",
          whiteSpace: "document",
        }}
      >
        {message.type === "question" && (
          <div className="text-gray-200 text-sm p-2 pt-0 pb-0 text-right mt-0">
            <strong>Chat mode: </strong>
            {message.chatMode}
          </div>
        )}
        {message.chatMode === "dataset" &&
          fileName &&
          message.type === "question" && (
            <div className="text-gray-200 text-base mb-2 p-2 pt-0 pb-0 flex items-center">
              <strong className="text-gray-300 mr-2">
                <FileText />
              </strong>
              <span>
                {fileName.length > 15
                  ? `${fileName.substring(0, 50)}...`
                  : fileName}
              </span>
            </div>
          )}

        <div className="relative flex items-right justify-end space-x-2">
          {message.type !== "question" && (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() =>
                  isSpeaking ? stopSpeech() : speakText(message.text)
                }
                className="flex items-center justify-center px-2 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:text-white hover:bg-gray-800"
                title={isSpeaking ? "Stop Speaking" : "Speak Message"}
              >
                {isSpeaking ? (
                  <GiSpeakerOff className="text-gray-300 text-lg" />
                ) : (
                  <GiSpeaker className="text-gray-300 text-lg" />
                )}
              </button>
            </div>
          )}

          {message.type !== "question" && (
            <div className="flex items-center" key={message.id}>
              <button
                onClick={() =>
                  handleCopy(message.id, `rendered-message-${message.id}`)
                }
                className="flex items-center justify-center px-2 py-1 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:text-white hover:bg-gray-800"
                title="Copy to clipboard"
              >
                <GoCopy className="mr-0" />
              </button>
              {copiedMessageId &&
                copiedMessageId.toString() === message.id.toString() && (
                  <span className="ml-2 text-gray-400 text-sm">✔ Copied!!</span>
                )}
            </div>
          )}
        </div>

        <div id={`rendered-message-${message.id}`} className="relative">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ ...props }) => (
                <p className="m-2 whitespace-pre-line" {...props} />
              ),
              h1: ({ ...props }) => (
                <h1 className="text-2xl font-bold mb-2" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-xl font-bold mb-2" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-lg font-bold mb-2" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul className="list-disc list-inside m-5" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal m-5" {...props} />
              ),
              li: ({ ...props }) => <li className="mb-1" {...props} />,
              a: ({ ...props }) => (
                <a className="text-blue-400 hover:underline" {...props} />
              ),
              code: ({ inline, ...props }) =>
                inline ? (
                  <code
                    className="bg-gray-800 text-white px-1 py-0.5 rounded-md text-sm scrollBar flex-1 overflow-y-auto border-[#676767] scrollbar scrollbar-thumb-[#676767] scrollbar-track-transparent"
                    {...props}
                  />
                ) : (
                  <pre className="bg-gray-900 text-white p-4 rounded-lg overflow-auto scrollBar flex-1 overflow-y-auto border-[#676767] scrollbar scrollbar-thumb-[#676767] scrollbar-track-transparent">
                    <code {...props} />
                  </pre>
                ),

              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-4 pl-4 my-4 text-gray-300 border-gray-500 italic"
                  {...props}
                />
              ),
              strong: ({ ...props }) => (
                <strong className="font-bold" {...props} />
              ),
              table: ({ ...props }) => (
                <table
                  className="table-auto border-collapse border border-gray-500"
                  {...props}
                />
              ),
              thead: ({ ...props }) => (
                <thead className="bg-gray-700 text-white" {...props} />
              ),
              tr: ({ ...props }) => (
                <tr className="border border-gray-500" {...props} />
              ),
              th: ({ ...props }) => (
                <th className="px-4 py-2 border border-gray-500" {...props} />
              ),
              td: ({ ...props }) => (
                <td className="px-4 py-2 border border-gray-500" {...props} />
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  showCopied: PropTypes.bool.isRequired,
  isMarkdown: PropTypes.bool.isRequired,
  fileName: PropTypes.string,
  selectedChatMode: PropTypes.string.isRequired,
  setCopiedMessageId: PropTypes.func.isRequired,
  copiedMessageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Message;
