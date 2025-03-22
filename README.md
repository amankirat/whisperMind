# WhisperMind

WhisperMind is a modern chat interface that combines voice recognition with LLaMA's powerful language model capabilities. It features a sleek, ChatGPT-like interface with voice-to-text functionality and real-time AI responses.

## Features

- 🎙️ Voice-to-text input with automatic speech recognition
- 💬 Real-time chat interface
- 🤖 Powered by LLaMA 3.2B Instruct model
- 🎨 Modern, responsive UI
- ⚡ Fast local AI responses

## Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)
- LM Studio (for running the LLaMA model)
- At least 8GB RAM recommended
- Modern web browser with speech recognition support (Chrome recommended)

## Setup Instructions

### 1. Setting up LM Studio

1. Download and install LM Studio from [https://lmstudio.ai/](https://lmstudio.ai/)
2. Launch LM Studio
3. Go to the "Models" tab
4. Search for "llama-3.2-3b-instruct"
5. Download the model by clicking the download button
6. Once downloaded, go to the "Local Server" tab
7. Select "llama-3.2-3b-instruct" from the model dropdown
8. Click "Start Server"
   - The server will start on http://localhost:80
   - Make sure port 80 is available

### 2. Setting up the WhisperMind Application

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd llamagpt
   ```

2. Install dependencies:
   ```bash
   npm install
   # If you encounter any errors, try:
   npm install --legacy-peer-deps
   ```

3. Install additional required packages:
   ```bash
   npm install @chakra-ui/react@2.8.0 @emotion/react@^11 @emotion/styled@^11 framer-motion@^6 react-icons --legacy-peer-deps
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Starting a New Chat**
   - Click the "New chat" button in the sidebar to start a fresh conversation

2. **Text Input**
   - Type your message in the input field
   - Press Enter or click the send button to submit

3. **Voice Input**
   - Click the microphone icon to start voice recording
   - Speak your message
   - Recording will automatically stop when you pause speaking
   - The message will be sent automatically
   - Click the stop button (red microphone) to manually stop recording

4. **Viewing Responses**
   - AI responses appear in the chat with an "L" avatar
   - Your messages appear with a "U" avatar
   - Scroll through the conversation history

## Troubleshooting

1. **LM Studio Issues**
   - Ensure the LM Studio server is running on port 80
   - Check if the model is properly loaded in LM Studio
   - Verify the server status in LM Studio's "Local Server" tab

2. **Application Issues**
   - Clear your browser cache and reload
   - Check browser console for any errors
   - Ensure all dependencies are properly installed
   - Try reinstalling node_modules if you encounter compilation errors:
     ```bash
     rm -rf node_modules package-lock.json
     npm install --legacy-peer-deps
     ```

3. **Speech Recognition Issues**
   - Ensure you're using a supported browser (Chrome recommended)
   - Grant microphone permissions when prompted
   - Check if your microphone is properly connected and working

## Technical Details

- Frontend: React with Chakra UI
- Speech Recognition: Web Speech API
- AI Model: LLaMA 3.2B Instruct
- API Endpoint: http://localhost:80/v1/chat/completions
- Node Version: 16+ recommended

## Browser Support

- Google Chrome (recommended)
- Microsoft Edge
- Safari
- Firefox (limited speech recognition support)

## Contributing

Feel free to submit issues and enhancement requests!

## License

[Add your license here]
