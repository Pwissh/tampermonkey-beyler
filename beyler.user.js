// ==UserScript==
// @name         beyler
// @namespace    http://tampermonkey.net/
// @version      0.1b
// @description  Replace every chat message from linuxcu1 with "beyler"
// @match        https://btt.community/chat/c/sohbet/2
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== BEYLER ===');

    let processedMessages = new Set(); // Aynı mesajı tekrar işlememeye için

    function modifyLinuxcuMessages() {
        // Tüm chat mesaj containerlarını bul
        const messageContainers = document.querySelectorAll('.chat-message-container');

        messageContainers.forEach(container => {
            // Username elementini bul
            const usernameElement = container.querySelector('.chat-message-info__username__name');

            if (usernameElement && usernameElement.textContent.trim() === 'linuxcu1') {

                // Bu mesajı daha önce işledik mi kontrol et
                const messageId = container.getAttribute('data-id') || container.innerHTML.substring(0, 50);

                if (!processedMessages.has(messageId)) {
                    console.log('LINUXCU1 MESAJI BULUNDU!');

                    // Mesaj içeriğini bul
                    const messageContent = container.querySelector('.chat-cooked');

                    if (messageContent) {
                        const originalText = messageContent.innerHTML;
                        console.log('Eski mesaj:', originalText);

                        // Mesajı değiştir
                        messageContent.innerHTML = '<p>beyler</p>';

                        console.log('Mesaj "beyler" olarak değiştirildi!');
                        processedMessages.add(messageId);
                    }
                }
            }
        });
    }

    // Mutasyona uğramış Observer  yeni mesajları yakalamak için
    const observer = new MutationObserver((mutations) => {
        let shouldProcess = false;

        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.classList) {
                    if (node.classList.contains('chat-message-container') ||
                        node.querySelector && node.querySelector('.chat-message-container')) {
                        shouldProcess = true;
                        }
                }
            });
        });

        if (shouldProcess) {
            setTimeout(modifyLinuxcuMessages, 100);
        }
    });

    // Observer'ı başlat
    function startObserver() {
        const targetNode = document.body;

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        console.log('Observer başlatıldı');
    }

    // İlk yükleme - mevcut mesajları kontrol et
    function checkInitialMessages() {
        console.log('Mevcut mesajlar kontrol ediliyor...');
        modifyLinuxcuMessages();

        // Her 2 saniyede bir kontrol et (güvenlik için)
        setInterval(() => {
            modifyLinuxcuMessages();
        }, 2000);
    }

    // Başlangıç
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            startObserver();
            setTimeout(checkInitialMessages, 1000);
        });
    } else {
        startObserver();
        setTimeout(checkInitialMessages, 1000);
    }

    // Sayfa değiştiğinde temizlik
    window.addEventListener('beforeunload', () => {
        observer.disconnect();
    });

    console.log('Eklenti hazır - linuxcu1 mesajları izleniyor...');

})();
