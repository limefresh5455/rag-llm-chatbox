import React from "react";
import Message from "./Message";
import PropTypes from "prop-types";

const MessageList = ({
  messages,
  handleCopy,
  showCopied,
  fileName,
  selectedChatMode,
}) => {
  return (
    <div className="mb-0 space-y-2">
      {messages.map((message, index) => (
        <Message
          key={message.id || index}
          message={message}
          handleCopy={handleCopy}
          showCopied={showCopied}
          isMarkdown={message.type === "response"}
          fileName={fileName}
          selectedChatMode={selectedChatMode}
        />
      ))}
    </div>
  );
};

// Adding PropTypes validation
MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleCopy: PropTypes.func.isRequired,
  showCopied: PropTypes.bool.isRequired,
  fileName: PropTypes.string,
  selectedChatMode: PropTypes.string.isRequired,
};

export default MessageList;
