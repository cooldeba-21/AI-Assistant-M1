const API_KEY = "AIzaSyDF9HWIl-B8odnHaSXuLb9Xa4n6vBQCocU"; 
const chatContainer = document.querySelector(".chat-container");
const inputField = document.getElementById("input-field");
const sendButton = document.querySelector(".send-button");

const chatbot = document.querySelector('.chatbot');
const closeButton = document.querySelector('.close');
const toggleButton = document.getElementById('chat-toggle');
const mainContainer = document.querySelector('.main-container');
const contactSection = document.getElementById('contact');

document.getElementById("open-chat").addEventListener("click", function() {
  document.querySelector(".chatbot").classList.remove("hidden");
  document.getElementById("chat-toggle").classList.add("hidden");
});

closeButton.addEventListener('click', () => {
    chatbot.classList.add('hidden');
    toggleButton.classList.remove('hidden');
});

toggleButton.addEventListener('click', () => {
    chatbot.classList.remove('hidden');
    toggleButton.classList.add('hidden');
});
document.getElementById('contact-toggle').addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if (contactSection.style.display === 'none' || contactSection.style.display === '') {
        contactSection.style.display = 'block';
    } else {
        contactSection.style.display = 'none';
    }
});


function showTypingAnimation() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "typing";
    typingDiv.innerHTML = `
        <p>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </p>
    `;
    typingDiv.setAttribute("id", "typing-animation");
    chatContainer.appendChild(typingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeTypingAnimation() {
    const typing = document.getElementById("typing-animation");
    if (typing) {
        typing.remove();
    }
}

async function sendMessage() {
    const userMessage = inputField.value.trim();
    if (!userMessage) {
        alert("Please enter a message.");
        return;
    }

    inputField.value = "";

    // USER MESSAGE
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.innerHTML = `<p>${userMessage}</p>`;
    chatContainer.appendChild(userDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    showTypingAnimation();
    // Simulate a delay for the bot response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
        
        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: userMessage }]
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
        removeTypingAnimation();

        // BOT RESPONSE
        const modelDiv = document.createElement("div");
        modelDiv.className = "model";
        modelDiv.innerHTML = `<p>${text}</p>`;
        chatContainer.appendChild(modelDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

    } catch (error) {
        console.error("Error getting response from Gemini:", error);
        removeTypingAnimation();

        const errorDiv = document.createElement("div");
        errorDiv.className = "model";
        errorDiv.innerHTML = `<p>Error:Unable to get response from Gemini. </p>`;
        chatContainer.appendChild(errorDiv);
    }
}

sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
//  INITIAL MESSAGE OF BOT
document.addEventListener("DOMContentLoaded", () => {
    const welcomeDiv = document.createElement("div");
    welcomeDiv.className = "model";
    welcomeDiv.innerHTML = `<p>Welcome to the AI Chatbot! Type your message and press Enter or click Send.</p>`;
    chatContainer.appendChild(welcomeDiv);
    contactSection.style.display = 'none'; 
});
//  RESPONSIVE DESIGN
window.addEventListener("resize", () => {
    if (window.innerWidth <= 480) {
        chatbot.style.width = "100vw";
        chatbot.style.height = "100vh";
        mainContainer.style.display = "none";
    } else {
        chatbot.style.width = "400px";
        chatbot.style.height = "600px";
        mainContainer.style.display = "block";
    }
});
//  INITIAL RESPONSIVE SETUP
if (window.innerWidth <= 480) {
    chatbot.style.width = "100vw";
    chatbot.style.height = "100vh";
    document.querySelector('.main-container').classList.add('hidden');
}else{
    document.querySelector('.main-container').classList.remove('hidden');
}

