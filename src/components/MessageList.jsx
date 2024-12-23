import React, { useState } from "react";
import Message from "./Message";
import PropTypes from "prop-types";

const MessageList = ({
  messages,
  copiedMessageId,
  setCopiedMessageId,
  handleCopy,
  fileName,
  selectedChatMode,
}) => {
  return (
    <div className="mb-0 space-y-2">
      {messages.map((message, index) => (
        <Message
          key={index}
          message={{ ...message, id: message.id || index }}
          onClick={() => setCopiedMessageId(message.id)}
          className={copiedMessageId === message.id ? "highlight" : ""}
          handleCopy={handleCopy}
          copiedMessageId={String(copiedMessageId)}
          setCopiedMessageId={setCopiedMessageId}
          showCopied={copiedMessageId === message.id}
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
  copiedMessageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setCopiedMessageId: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  selectedChatMode: PropTypes.string.isRequired,
};

export default MessageList;
