const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const messages = [];

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  messages.push({ role: "user", content: userMessage });
  userInput.value = "";

  addMessage("bot", "Thinking...");

  try {
    const response = await fetch("/.netlify/functions/chatgpt", {
      method: "POST",
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();
    if (data.message) {
      messages.push({ role: "assistant", content: data.message });
      updateLastBotMessage(data.message);
    } else {
      updateLastBotMessage("Error from server.");
    }
  } catch (err) {
    updateLastBotMessage("Network error.");
  }
});

function addMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.textContent = text;
  chatLog.appendChild(msgDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function updateLastBotMessage(text) {
  const botMessages = document.querySelectorAll(".bot");
  const lastBotMessage = botMessages[botMessages.length - 1];
  if (lastBotMessage) {
    lastBotMessage.textContent = text;
  }
}
