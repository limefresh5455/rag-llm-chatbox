import React, { useState } from "react";

const VoiceApp = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([]);

  const synth = window.speechSynthesis;

  const runSpeechRecog = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      setListening(false);
      sendMessage(spokenText);
    };

    recognition.onerror = () => {
      setListening(false);
      console.error("Speech recognition error");
    };

    recognition.start();
  };

  const sendMessage = (message) => {
    showUserMessage(message);
    sendToFlaskAPI(message);
  };

  const sendToFlaskAPI = (message) => {
    fetch("/api/process_text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from Flask API:", data);
        handleResponse(data);
      })
      .catch((error) => {
        console.error("Error sending data to Flask API:", error);
      });
  };

  const handleResponse = (data) => {
    showBotMessage(data);
    speakResponse(data);
  };

  const showUserMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", content: message },
    ]);
  };

  const showBotMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "bot", content: message },
    ]);
  };
  const speakResponse = (response) => {
    const utterance = new SpeechSynthesisUtterance(response);
    synth.speak(utterance);

    window.addEventListener("beforeunload", () => {
      if (synth.speaking) {
        synth.cancel();
      }
    });

    document.getElementById("stop-speech").addEventListener("click", () => {
      if (synth.speaking) {
        synth.cancel();
      }
    });
  };

  return (
    <div>
      <h1>Voice Interaction App</h1>

      <p>{listening ? "Listening..." : 'Click "Start" to Speak'}</p>

      <button onClick={runSpeechRecog}>Start Listening</button>
      <button id="stop-speech">Stop Speaking</button>

      <div
        id="chat-box"
        style={{ border: "1px solid #ccc", padding: "10px", maxWidth: "400px" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.type === "user" ? "user-message" : "bot-message"}
            style={{
              textAlign: msg.type === "user" ? "right" : "left",
              margin: "5px 0",
              color: msg.type === "user" ? "blue" : "green",
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default VoiceApp;
