/**
 * Haje AI Assistant Widget
 * Modern, Vanilla JS, Multimodal Chatbot
 */

(function() {
    // === 1. Inject HTML Structure ===
    const widgetHTML = `
    <div id="haje-widget" class="haje-widget-container">
        <!-- Floating Button -->
        <button id="haje-floating-btn" class="haje-floating-btn" aria-label="Buka Haje Assistant">
            <div class="haje-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 8V16M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
            <span class="haje-online-indicator"></span>
        </button>

        <!-- Chat Popup -->
        <div id="haje-chat-popup" class="haje-chat-popup">
            <div class="haje-header">
                <div class="haje-header-info">
                    <div class="haje-header-avatar">
                        <img src="../foto%20haje.jpeg" alt="Haje">
                    </div>
                    <div>
                        <h3 class="haje-title">Haje AI Assistant</h3>
                        <p class="haje-subtitle">Powered by Gemini AI</p>
                    </div>
                </div>
                <div class="haje-header-actions">
                    <button id="haje-minimize-btn" class="haje-icon-btn" aria-label="Minimize">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 12H18" stroke-linecap="round"/></svg>
                    </button>
                    <button id="haje-close-btn" class="haje-icon-btn" aria-label="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6L18 18" stroke-linecap="round"/></svg>
                    </button>
                </div>
            </div>

            <div id="haje-chat-body" class="haje-chat-body">
                <!-- Pesan akan ditambahkan di sini -->
            </div>

            <div class="haje-footer">
                <div id="haje-file-preview" class="haje-file-preview">
                    <div class="haje-file-info">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
                        <span id="haje-file-name" class="haje-file-name"></span>
                    </div>
                    <button id="haje-remove-file-btn" class="haje-icon-btn" style="width:24px; height:24px;" aria-label="Hapus File">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6L18 18" stroke-linecap="round"/></svg>
                    </button>
                </div>
                
                <div class="haje-input-wrapper">
                    <input type="text" id="haje-chat-input" class="haje-input" placeholder="Tanya Haje sesuatu..." autocomplete="off">
                    
                    <div class="haje-actions">
                        <button class="haje-action-btn" data-tooltip="Upload Image" onclick="document.getElementById('haje-image-upload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </button>
                        <input type="file" id="haje-image-upload" accept="image/*" style="display:none;">

                        <button class="haje-action-btn" data-tooltip="Upload Document" onclick="document.getElementById('haje-doc-upload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        </button>
                        <input type="file" id="haje-doc-upload" accept=".pdf,.doc,.docx,.txt" style="display:none;">

                        <button class="haje-action-btn" data-tooltip="Upload Audio" onclick="document.getElementById('haje-audio-upload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                        </button>
                        <input type="file" id="haje-audio-upload" accept="audio/*" style="display:none;">
                    </div>

                    <button id="haje-send-btn" class="haje-send-btn" aria-label="Kirim">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Inject to body
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // === 2. Variables & State ===
    const API_BASE_URL = 'http://localhost:3000';
    let activeFile = null;
    let activeFileType = null; // 'image', 'document', 'audio'
    let isWelcomeMessageShown = false;

    // Elements
    const floatingBtn = document.getElementById('haje-floating-btn');
    const chatPopup = document.getElementById('haje-chat-popup');
    const closeBtn = document.getElementById('haje-close-btn');
    const minimizeBtn = document.getElementById('haje-minimize-btn');
    const chatBody = document.getElementById('haje-chat-body');
    const chatInput = document.getElementById('haje-chat-input');
    const sendBtn = document.getElementById('haje-send-btn');
    
    // File elements
    const filePreview = document.getElementById('haje-file-preview');
    const fileNameDisplay = document.getElementById('haje-file-name');
    const removeFileBtn = document.getElementById('haje-remove-file-btn');
    const imageUpload = document.getElementById('haje-image-upload');
    const docUpload = document.getElementById('haje-doc-upload');
    const audioUpload = document.getElementById('haje-audio-upload');

    // === 3. UI Interactions ===

    // Toggle Chat
    floatingBtn.addEventListener('click', () => {
        chatPopup.classList.add('haje-open');
        chatPopup.classList.remove('haje-minimized');
        floatingBtn.style.display = 'none'; // hide floating button
        
        if (!isWelcomeMessageShown) {
            showWelcomeMessage();
            isWelcomeMessageShown = true;
        }
    });

    // Close Chat
    closeBtn.addEventListener('click', () => {
        chatPopup.classList.remove('haje-open');
        setTimeout(() => {
            floatingBtn.style.display = 'flex';
        }, 300);
    });

    // Minimize Chat
    minimizeBtn.addEventListener('click', () => {
        chatPopup.classList.toggle('haje-minimized');
    });

    // Handle File Selection
    const handleFileSelect = (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        activeFile = file;
        activeFileType = type;
        
        fileNameDisplay.textContent = file.name;
        filePreview.classList.add('haje-active');
        
        // Reset input so same file can be selected again if needed
        event.target.value = '';
    };

    imageUpload.addEventListener('change', (e) => handleFileSelect(e, 'image'));
    docUpload.addEventListener('change', (e) => handleFileSelect(e, 'document'));
    audioUpload.addEventListener('change', (e) => handleFileSelect(e, 'audio'));

    // Remove File
    removeFileBtn.addEventListener('click', () => {
        activeFile = null;
        activeFileType = null;
        filePreview.classList.remove('haje-active');
    });

    // Send Message on Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Send on Button Click
    sendBtn.addEventListener('click', sendMessage);

    // === 4. Core Logic ===

    function showWelcomeMessage() {
        const msg = "Halo, saya Haje 👋<br>Ada yang bisa saya bantu hari ini?";
        appendMessage(msg, 'ai');
    }

    function appendMessage(text, sender) {
        const wrapper = document.createElement('div');
        wrapper.className = `haje-message-wrapper haje-message-${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'haje-message-bubble';
        bubble.innerHTML = formatText(text);
        
        wrapper.appendChild(bubble);
        chatBody.appendChild(wrapper);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'haje-message-wrapper haje-message-ai haje-typing-wrapper';
        wrapper.id = 'haje-typing-indicator';
        
        const bubble = document.createElement('div');
        bubble.className = 'haje-message-bubble haje-typing';
        
        bubble.innerHTML = `
            <div class="haje-dot"></div>
            <div class="haje-dot"></div>
            <div class="haje-dot"></div>
        `;
        
        wrapper.appendChild(bubble);
        chatBody.appendChild(wrapper);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('haje-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Basic markdown formatter
    function formatText(text) {
        if (!text) return '';
        // Replace newlines with <br>
        let formatted = text.replace(/\n/g, '<br>');
        // Bold
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        return formatted;
    }

    async function sendMessage() {
        const text = chatInput.value.trim();
        
        if (!text && !activeFile) return;

        // Display user message
        let userMessageStr = text;
        if (activeFile) {
            userMessageStr += `<br><small>📎 <i>Attached: ${activeFile.name}</i></small>`;
        }
        
        appendMessage(userMessageStr, 'user');
        
        // Clear inputs
        chatInput.value = '';
        const fileToSend = activeFile;
        const fileTypeToSend = activeFileType;
        const textToSend = text;
        
        // Reset file state UI
        activeFile = null;
        activeFileType = null;
        filePreview.classList.remove('haje-active');

        showTypingIndicator();

        try {
            let responseData;

            if (!fileToSend) {
                // TEXT ONLY ENDPOINT
                const response = await fetch(`${API_BASE_URL}/generate-text`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: textToSend })
                });
                
                if (!response.ok) throw new Error('Network response was not ok');
                responseData = await response.json();
                
            } else {
                // MULTIMODAL ENDPOINTS
                const formData = new FormData();
                if (textToSend) {
                    formData.append('prompt', textToSend);
                }

                let endpoint = '';
                if (fileTypeToSend === 'image') {
                    formData.append('image', fileToSend);
                    endpoint = '/generate-from-image';
                } else if (fileTypeToSend === 'document') {
                    formData.append('document', fileToSend);
                    endpoint = '/generate-from-document';
                } else if (fileTypeToSend === 'audio') {
                    formData.append('audio', fileToSend);
                    endpoint = '/generate-from-audio';
                }

                const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Gagal mengunggah file atau memproses permintaan');
                responseData = await response.json();
            }

            removeTypingIndicator();
            
            if (responseData && responseData.result) {
                appendMessage(responseData.result, 'ai');
            } else {
                appendMessage("Maaf, terjadi kesalahan saat memproses jawaban.", 'ai');
            }

        } catch (error) {
            console.error('Haje Error:', error);
            removeTypingIndicator();
            appendMessage("Maaf, terjadi kesalahan koneksi. Pastikan server AI berjalan.", 'ai');
        }
    }

})();
