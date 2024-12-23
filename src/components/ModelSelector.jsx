import PropTypes from "prop-types";

const ModelSelector = ({
  selectedModel,
  setSelectedModel,
  selectedChatMode,
}) => {
  const modelOptions =
    selectedChatMode === "document"
      ? [
          "OpenAI-GPT-4.o-mini",
          "OpenAI-GPT-4.o",
          "OpenAI-GPT-o1-mini",
          "OpenAI-GPT-4.o1-preview",
          "Claude-Sonnet-3.5",
          "Google-Gemini-1.5-Pro",
        ]
      : [
          "OpenAI-GPT-4.o-mini",
          "OpenAI-GPT-4.o",
          "OpenAI-GPT-o1-mini",
          "OpenAI-GPT-4.o1-preview",
          "Claude-Sonnet-3.5",
          "Google-Gemini-1.5-Pro",
        ];

  return (
    <div className="mr-4 flex items-center space-x-4 justify-center">
      <label className="text-lg text-[#b4b4b4]">Select Model:</label>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="p-3 bg-[#212121] text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus-within:ring-[#212121] transition duration-200 "
      >
        {modelOptions.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

// PropTypes validation
ModelSelector.propTypes = {
  selectedModel: PropTypes.string.isRequired,
  setSelectedModel: PropTypes.func.isRequired,
  selectedChatMode: PropTypes.string.isRequired,
};

export default ModelSelector;
