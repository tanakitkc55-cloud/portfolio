// GitHub Pages demo. The original Socket.IO application remains in script.js.
window.addEventListener('DOMContentLoaded', function () {
    let username = '';
    const nameInput = document.getElementById('userInput');
    const messageInput = document.getElementById('userMsg');
    const send = document.getElementById('submitmsg');
    const box = document.getElementById('chatbox');
    document.getElementById('clickok').addEventListener('click', function () {
        if (!nameInput.value.trim()) { nameInput.focus(); return; }
        username = nameInput.value.trim();
        document.getElementById('username').textContent = username;
        send.disabled = false;
        nameInput.disabled = true;
        this.disabled = true;
        messageInput.focus();
    });
    function sendMessage() {
        if (!username || !messageInput.value.trim()) return;
        const row = document.createElement('div'); row.className = 'message';
        const name = document.createElement('b'); name.textContent = username;
        row.append(name, document.createTextNode(': ' + messageInput.value.trim()));
        box.appendChild(row); box.scrollTop = box.scrollHeight;
        messageInput.value = ''; messageInput.focus();
    }
    send.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') { event.preventDefault(); sendMessage(); }
    });
});
