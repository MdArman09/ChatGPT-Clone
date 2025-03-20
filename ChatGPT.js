const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const helpText = document.getElementById("helpText"); // Get the helpText element
const logo = document.querySelector(".ChatGPT-Logo"); // Ensure this selector matches your logo's class
// const deleteButton = document.querySelector("delete-btn");

let userText = null;
const OPENAI_API_KEY = "YOUR_API_KEY_HERE";
let chatHistory = [
    {"role": "system", "content": "You are a helpful assistant. and always try to answer perfectly without any hesitation and at least output a minimum of  2048 tokens"}
]

// const loadDatafromlocalstorage = () => {
//     chatContainer.innerHTML = localStorage.getItem("all-chats");
// }

// loadDatafromlocalstorage(); 



const createElement = (html, className) => {
    // Create new div and apply, specified class and set html content of div
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv; //Return the created chat vdiv
}

const getchatResponse = async (incomingChatDiv) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const pElement = document.createElement("p");
    chatHistory.push({"role": "user", "content": userText});

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
       model: "gpt-3.5-turbo",
       messages: chatHistory,
       temperature: 1.0,
       max_tokens: 2048
    })
    }

    //Send POST request to API, get response and set the response as paragraph element text
    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        const messageContent = response.choices[0]["message"]["content"];
        pElement.textContent = messageContent;
        chatHistory.push({"role": "assistant", "content": messageContent});
    } catch(error) {
        console.log(error);
    }

    //Removing the typing animation, append the paragraph element and save the chats to local storage
    incomingChatDiv.querySelector(".typing-animation").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML);
}   
const copyResponse = (copyBtn) => {
    //Copy the text content of the response to the clipboard
    const responseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(responseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() =>copyBtn.textContent = "content_copy",1000);
}

const showTypingAnimation = () => {
    const html  = `<div class="chat-content">
    <div class="chat-details">
        <img src="chatbot.jpg" alt="Chatbot-img">
         <div class="typing-animation">
           <div class="typing-dot"style ="--delay:0.2s"></div> 
           <div class="typing-dot"style ="--delay:0.3s"></div> 
           <div class="typing-dot"style ="--delay:0.4s"></div> 
         </div>
    </div>
     <span onclick = "copyResponse(this)" class="material-symbols-outlined">content_copy</span>
</div>`;
// Create an incoming chat div with typing animation and append it to chat container
const incomingChatDiv = createElement(html, "incoming");
chatContainer.appendChild(incomingChatDiv);
getchatResponse(incomingChatDiv);
}



const handleOutgoingChat = () => {
    userText = chatInput.value.trim(); // Get ChatInput value and remove extra space
    if (!userText) return; // If chatInput is empty, return from here

    // Create an outgoing chat div with user's message and append it to chat container
    const html = `<div class="chat-content">
        <div class="chat-details">
            <img src="user.jpg" alt="user-img">
            <p>${userText}</p>
        </div>
    </div>`;
    const outgoingChatDiv = createElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);

    // Clear input field after sending the message
    chatInput.value = ""; // For removing prompts from the input field

    // Temporarily disable the Enter key event listener to prevent multiple submissions
    chatInput.removeEventListener("keydown", enterKeyDownHandler);

    // Hide the help text and logo after the first message is sent
    helpText.style.display = 'none';
    logo.style.display = 'none';
}

// Handler function for the Enter key press event
const enterKeyDownHandler = (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior (submitting form)
        handleOutgoingChat(); // Call function to handle outgoing chat

        // Re-attach the Enter key event listener after a delay to allow processing
        setTimeout(() => {
            chatInput.addEventListener("keydown", enterKeyDownHandler);
        }, 1000); // Adjust the delay as needed
    }
}

// Attach the Enter key event listener to the chat input
chatInput.addEventListener("keydown", enterKeyDownHandler);



sendButton.addEventListener("click", handleOutgoingChat);

// Function to handle user input submission
const handleInputSubmission = async (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior of Enter key (submitting the form)

        // Get the user's input and trim any leading/trailing whitespace
        userText = chatInput.value.trim();
        if (!userText) return; // If input is empty, return

        // Create an outgoing chat div with user's message and append it to chat container
        const html = `<div class="chat-content">
            <div class="chat-details">
                <img src="user.jpg" alt="user-img">
                <p>${userText}</p>
            </div>
        </div>`;
        const outgoingChatDiv = createElement(html, "outgoing");
        chatContainer.appendChild(outgoingChatDiv);

        // Send the user's input to the API and handle the response
        await getchatResponse(outgoingChatDiv);

        // Clear the input field after sending the message
        chatInput.value = '';
    }
};

themeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.toggle("light-mode");
    if(isLightMode) {
        helpText.classList.add("light-mode-text"); // Change text to black
    } else {
        helpText.classList.remove("light-mode-text"); // Change text back to default
    }
    // Update Local Storage with the new theme setting
    localStorage.setItem("theme-color", isLightMode ? "light_mode" : "dark_mode");
});

// To maintain the state after a refresh, you can add this at the beginning of your script:
document.addEventListener('DOMContentLoaded', () => {
    // Check local storage and update the class if light mode was enabled
    if(localStorage.getItem("theme-color") === "light_mode") {
        document.body.classList.add("light-mode");
        helpText.classList.add("light-mode-text"); // Ensure text color is black in light mode
    }
});

 


document.addEventListener('DOMContentLoaded', () => {
    const deleteButton = document.querySelector("#delete-btn");
    const chatContainer = document.querySelector(".chat-container");

    deleteButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete all the chats?")) {
            // Select and remove only chat message elements
            const chatMessages = chatContainer.querySelectorAll(".chat");
            chatMessages.forEach(message => message.remove());

            // Reset the chat history array and local storage
            chatHistory = []; // Reset chat history if being tracked in an array
            localStorage.removeItem("all-chats"); // Clear stored chats if using local storage
        }
    });
});


// document.getElementById('download-chat').addEventListener('click', function() {
//     const chatContents = document.querySelectorAll('.chat-container .chat .chat-details p');
//     let chatData = Array.from(chatContents).map(p => p.textContent).join('\n');
    
//     const blob = new Blob([chatData], { type: 'text/plain;charset=utf-8' });
//     const url = window.URL.createObjectURL(blob);
//     const downloadLink = document.createElement('a');
//     downloadLink.href = url;
//     downloadLink.download = 'chat-history.txt';
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     document.body.removeChild(downloadLink);
//     window.URL.revokeObjectURL(url);
// });


// document.addEventListener('DOMContentLoaded', () => {
//     const chatInput = document.getElementById('chat-input');
//     const downloadButton = document.getElementById('download-chat');
//     const chatContainer = document.querySelector('.chat-container');

//     // Function to update the download button state
//     function updateDownloadButtonState() {
//         // Check if there is any chat in the chat container
//         const hasChat = chatContainer.querySelectorAll('.chat').length > 0;
//         downloadButton.disabled = !hasChat;
//     }

//     // Function to add chat to the container (modify this based on how you handle chat)
//     function addChatToContainer(message, sender) {
//         const messageElement = document.createElement('div');
//         messageElement.className = 'chat ' + (sender === 'user' ? 'outgoing' : 'incoming');
//         messageElement.innerHTML = `<div class="chat-details"><p>${message}</p></div>`;
//         chatContainer.appendChild(messageElement);
//         updateDownloadButtonState(); // Update the button state whenever a new chat is added
//     }

//     // Event listener for chat submission
//     chatInput.addEventListener('keypress', event => {
//         if (event.key === 'Enter' && chatInput.value.trim() !== '') {
//             addChatToContainer(chatInput.value.trim(), 'user');
//             chatInput.value = ''; // Clear input after sending
//         }
//     });

//     // Download chat history
//     downloadButton.addEventListener('click', () => {
//         const chatContents = document.querySelectorAll('.chat-container .chat .chat-details p');
//         let chatData = Array.from(chatContents).map(p => p.textContent).join('\n');
        
//         const blob = new Blob([chatData], { type: 'text/plain;charset=utf-8' });
//         const url = window.URL.createObjectURL(blob);
//         const downloadLink = document.createElement('a');
//         downloadLink.href = url;
//         downloadLink.download = 'chat-history.txt';
//         document.body.appendChild(downloadLink);
//         downloadLink.click();
//         document.body.removeChild(downloadLink);
//         window.URL.revokeObjectURL(url);
//     });

//     // Initial check (in case there are already chats when loading the page)
//     updateDownloadButtonState();
// });



//This part of code is used for download the chathistory
document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.querySelector('.chat-container');
    const downloadButton = document.getElementById('download-chat');

    // Function to check and update the download button state based on chat content
    function updateDownloadButton() {
        const hasChats = chatContainer.querySelectorAll('.chat .chat-details p').length > 0;
        downloadButton.disabled = !hasChats;
        if (hasChats) {
            downloadButton.style.opacity = '1';
            downloadButton.style.cursor = 'pointer';
        } else {
            downloadButton.style.opacity = '0.5';
            downloadButton.style.cursor = 'not-allowed';
        }
    }

    // Monitor the chat container for changes to enable the download button
    const observer = new MutationObserver(() => {
        updateDownloadButton();
    });

    // Observe direct children changes in the chat container
    observer.observe(chatContainer, {
        childList: true, // listen for direct children additions or deletions
        subtree: true   // listen for deep changes in descendants
    });

    // Event listener for the download button
    downloadButton.addEventListener('click', function() {
        if (!this.disabled) {
            const chatContents = document.querySelectorAll('.chat-container .chat .chat-details p');
            const chatData = Array.from(chatContents).map(p => p.textContent).join('\n');
            
            const blob = new Blob([chatData], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'chat-history.txt';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(url);
        }
    });

    // Initial check to ensure the button starts in the correct state
    updateDownloadButton();
});


// document.getElementById('file-input').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         console.log("File uploaded:", file.name);
//         // Handle the file upload here (e.g., send to a server or store locally)
//     }
// });

 

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileUrl = e.target.result;
            if (file.type.startsWith('image/')) {
                // Create an image element and display it in the chat
                const img = document.createElement('img');
                img.src = fileUrl;
                img.style.maxWidth = '100px';
                img.style.maxHeight = '100px';
                appendMessageToChat(img.outerHTML, 'outgoing');
            } else {
                // Display the file name in the chat
                appendMessageToChat(`Uploaded file: ${file.name}`, 'outgoing');
            }
            // Save chat to localStorage or send to AI if necessary
            localStorage.setItem('all-chats', chatContainer.innerHTML);
        };
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file); // or handle other file types as needed
        }
    }
});

function appendMessageToChat(messageHTML, type) {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat', type);
    chatDiv.innerHTML = `<div class="chat-content"><div class="chat-details">${messageHTML}</div></div>`;
    chatContainer.appendChild(chatDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto scroll to the latest message
}


 


