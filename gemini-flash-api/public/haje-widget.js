/**
 * Haje AI Assistant Widget
 * Fullscreen Panel — Slide In/Out Animation
 */

(function() {
    // === 1. Inject HTML Structure ===
    const widgetHTML = `
    <div id="haje-widget" class="haje-widget-container">

        <!-- Floating Trigger Button -->
        <button id="haje-floating-btn" class="haje-floating-btn" aria-label="Buka Haje Assistant">
            <div class="haje-btn-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <span class="haje-online-indicator"></span>
        </button>

        <!-- Fullscreen Chat Panel -->
        <div id="haje-chat-popup" class="haje-chat-popup" role="dialog" aria-label="Haje AI Assistant">

            <!-- Header -->
            <div class="haje-header">
                <div class="haje-header-info">
                    <div class="haje-header-avatar">
                        <img src="/foto haje.jpeg" alt="Haje" onerror="this.style.display='none'">
                    </div>
                    <div>
                        <h3 class="haje-title">Haje AI Assistant</h3>
                        <p class="haje-subtitle">Powered by Gemini AI</p>
                    </div>
                </div>
                <div class="haje-header-actions">
                    <button id="haje-close-btn" class="haje-icon-btn" aria-label="Tutup">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Chat Body -->
            <div id="haje-chat-body" class="haje-chat-body"></div>

            <!-- Footer / Input -->
            <div class="haje-footer">
                <div id="haje-file-preview" class="haje-file-preview">
                    <div class="haje-file-info">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                        </svg>
                        <span id="haje-file-name" class="haje-file-name"></span>
                    </div>
                    <button id="haje-remove-file-btn" class="haje-icon-btn" style="width:24px;height:24px;" aria-label="Hapus file">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6L18 18" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>

                <div class="haje-input-wrapper">
                    <input type="text" id="haje-chat-input" class="haje-input"
                           placeholder="Tanya Haje sesuatu..." autocomplete="off">

                    <div class="haje-actions">
                        <button class="haje-action-btn" data-tooltip="Gambar"
                                onclick="document.getElementById('haje-image-upload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                            </svg>
                        </button>
                        <input type="file" id="haje-image-upload" accept="image/*" style="display:none;">

                        <button class="haje-action-btn" data-tooltip="Dokumen"
                                onclick="document.getElementById('haje-doc-upload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                        </button>
                        <input type="file" id="haje-doc-upload" accept=".pdf,.doc,.docx,.txt" style="display:none;">

                        <button class="haje-action-btn" data-tooltip="Audio"
                                onclick="document.getElementById('haje-audio-upload').click()">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                <line x1="12" y1="19" x2="12" y2="23"/>
                                <line x1="8" y1="23" x2="16" y2="23"/>
                            </svg>
                        </button>
                        <input type="file" id="haje-audio-upload" accept="audio/*" style="display:none;">
                    </div>

                    <button id="haje-send-btn" class="haje-send-btn" aria-label="Kirim">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="22" y1="2" x2="11" y2="13"/>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                    </button>
                </div>
            </div>

        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // === 2. State ===
    const API_BASE_URL = '';
    let activeFile = null;
    let activeFileType = null;
    let welcomeShown = false;

    // === 3. Elements ===
    const floatingBtn    = document.getElementById('haje-floating-btn');
    const chatPopup      = document.getElementById('haje-chat-popup');
    const closeBtn       = document.getElementById('haje-close-btn');
    const chatBody       = document.getElementById('haje-chat-body');
    const chatInput      = document.getElementById('haje-chat-input');
    const sendBtn        = document.getElementById('haje-send-btn');
    const filePreview    = document.getElementById('haje-file-preview');
    const fileNameDisplay= document.getElementById('haje-file-name');
    const removeFileBtn  = document.getElementById('haje-remove-file-btn');
    const imageUpload    = document.getElementById('haje-image-upload');
    const docUpload      = document.getElementById('haje-doc-upload');
    const audioUpload    = document.getElementById('haje-audio-upload');

    // === 4. Open / Close ===

    function openPanel() {
        chatPopup.classList.add('haje-open');
        floatingBtn.classList.add('haje-btn-hidden');
        if (!welcomeShown) {
            welcomeShown = true;
            showWelcomeMessage();
        }
        // Focus input after animation
        setTimeout(() => chatInput.focus(), 420);
    }

    function closePanel() {
        chatPopup.classList.remove('haje-open');
        // Show floating button after panel slides out
        setTimeout(() => {
            floatingBtn.classList.remove('haje-btn-hidden');
        }, 300);
    }

    floatingBtn.addEventListener('click', openPanel);
    closeBtn.addEventListener('click', closePanel);

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatPopup.classList.contains('haje-open')) {
            closePanel();
        }
    });

    // === 5. File Handling ===

    const handleFileSelect = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        activeFile = file;
        activeFileType = type;
        fileNameDisplay.textContent = file.name;
        filePreview.classList.add('haje-active');
        e.target.value = '';
    };

    imageUpload.addEventListener('change', (e) => handleFileSelect(e, 'image'));
    docUpload.addEventListener('change',   (e) => handleFileSelect(e, 'document'));
    audioUpload.addEventListener('change', (e) => handleFileSelect(e, 'audio'));

    removeFileBtn.addEventListener('click', () => {
        activeFile = null;
        activeFileType = null;
        filePreview.classList.remove('haje-active');
    });

    // === 6. Send ===

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) sendMessage();
    });

    sendBtn.addEventListener('click', sendMessage);

    // === 7. UI Helpers ===

    function showWelcomeMessage() {
        appendMessage('Halo, saya <strong>Haje</strong> 👋<br>Ada yang bisa saya bantu hari ini?', 'ai');
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
        bubble.innerHTML = '<div class="haje-dot"></div><div class="haje-dot"></div><div class="haje-dot"></div>';

        wrapper.appendChild(bubble);
        chatBody.appendChild(wrapper);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const el = document.getElementById('haje-typing-indicator');
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function formatText(text) {
        if (!text) return '';
        return text
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
    }

    // === 8. API Calls ===

    async function sendMessage() {
        const text = chatInput.value.trim();
        if (!text && !activeFile) return;

        let userMsg = text;
        if (activeFile) userMsg += `<br><small>📎 <i>${activeFile.name}</i></small>`;
        appendMessage(userMsg, 'user');

        chatInput.value = '';
        const fileToSend     = activeFile;
        const fileTypeToSend = activeFileType;
        const textToSend     = text;

        activeFile = null;
        activeFileType = null;
        filePreview.classList.remove('haje-active');

        sendBtn.disabled = true;
        showTypingIndicator();

        try {
            let data;

            if (!fileToSend) {
                const res = await fetch(`${API_BASE_URL}/generate-text`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: textToSend })
                });
                if (!res.ok) throw new Error(`Server error ${res.status}`);
                data = await res.json();

            } else {
                const form = new FormData();
                if (textToSend) form.append('prompt', textToSend);

                let endpoint = '';
                if (fileTypeToSend === 'image') {
                    form.append('image', fileToSend);
                    endpoint = '/generate-from-image';
                } else if (fileTypeToSend === 'document') {
                    form.append('document', fileToSend);
                    endpoint = '/generate-from-document';
                } else if (fileTypeToSend === 'audio') {
                    form.append('audio', fileToSend);
                    endpoint = '/generate-from-audio';
                }

                const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                    method: 'POST',
                    body: form
                });
                if (!res.ok) throw new Error(`Server error ${res.status}`);
                data = await res.json();
            }

            removeTypingIndicator();
            appendMessage(data.result || 'Maaf, tidak ada respons.', 'ai');

        } catch (err) {
            console.error('Haje Error:', err);
            removeTypingIndicator();
            appendMessage('Maaf, terjadi kesalahan koneksi. Pastikan server AI berjalan.', 'ai');
        } finally {
            sendBtn.disabled = false;
        }
    }

})();
