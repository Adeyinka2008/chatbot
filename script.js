document.getElementById("send-button").addEventListener("click", sendMessage);
document
  .getElementById("user-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const messageText = userInput.value.trim();

  if (messageText !== "") {
    const chatMessages = document.getElementById("chat-messages");

    // Add user message to chat
    const userMessageDiv = document.createElement("div");
    userMessageDiv.classList.add("message", "user");
    userMessageDiv.textContent = messageText;
    chatMessages.appendChild(userMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    userInput.value = "";

    // Fetch bot response from API
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct",
        // "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct",
        {
          headers: {
            Authorization: "Bearer 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",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: `${messageText} <|end|>  <|assistant|>`,
          }),
        }
      );

      // save user message online
      await fetch(
        "https://chatapi-h5ok.onrender.com/api/requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ content: messageText }),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const botMessageDiv = document.createElement("div");
        botMessageDiv.classList.add("message");
        botMessageDiv.textContent = data[0].generated_text
          .split("<|assistant|>")[1]
          .split("<|end|>");
        // botMessageDiv.textContent = data[0].generated_text;
        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  }
}

