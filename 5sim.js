// ==UserScript==
// @name         5sim Balance Changer to 200
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Change balance to 200 on 5sim.net website
// @author       You
// @match        https://5sim.net/*
// @match        http://5sim.net/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    console.log('5sim Balance Changer Script Loaded!');

    // ব্যালেন্স চেঞ্জ করার মূল ফাংশন
    function changeBalanceTo200() {
        console.log('Running balance changer...');

        // ১। প্রথমে সব টেক্সট নোড চেক করি
        const textNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // খালি টেক্সট স্কিপ
                    if (!node.textContent.trim()) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // ২। টেক্সট নোডে সার্চ করে ব্যালেন্স চেঞ্জ
        textNodes.forEach(textNode => {
            const originalText = textNode.textContent;
            let newText = originalText;

            // ব্যালেন্স প্যাটার্ন (5sim সাইটের জন্য অপটিমাইজড)
            const patterns = [
                // $0.00, $0, 0.00 USD
                /\$\s*0(?:\.00)?\b/i,
                /\b0(?:\.00)?\s*(?:USD|EUR|RUB|UAH|KZT|BYN)/i,
                
                // Balance: 0, Balance: 0.00
                /Balance:\s*0(?:\.00)?/i,
                /Баланс:\s*0(?:\.00)?/i, // রাশিয়ান
                
                // Recharge/টপ-আপ related
                /Recharge.*\$\d+/i,
                /Top-up.*\$\d+/i,
                /Пополнить.*\d+/i, // রাশিয়ান
                
                // সংখ্যা মাত্র (শুধু ০ বা ০.০০)
                /^\s*0(?:\.00)?\s*$/,
                /^\s*0\s*$/,
                
                // ইনপুট ভ্যালু
                /value\s*=\s*["']0(?:\.00)?["']/i
            ];

            patterns.forEach(pattern => {
                if (pattern.test(originalText)) {
                    // রিপ্লেসমেন্ট লজিক
                    newText = originalText
                        .replace(/\$\s*0(?:\.00)?/gi, '$200')
                        .replace(/\b0(?:\.00)?\s*(USD|EUR|RUB|UAH|KZT|BYN)/gi, '200 $1')
                        .replace(/Balance:\s*0(?:\.00)?/gi, 'Balance: 200')
                        .replace(/Баланс:\s*0(?:\.00)?/gi, 'Баланс: 200')
                        .replace(/Recharge.*\$\d+/gi, 'Recharge $200')
                        .replace(/Top-up.*\$\d+/gi, 'Top-up $200')
                        .replace(/\b0(?:\.00)?\b/gi, '200');
                }
            });

            if (newText !== originalText) {
                textNode.textContent = newText;
                console.log('Changed:', originalText, '→', newText);
            }
        });

        // ৩। সব span, div, button, a elements চেক করি
        const elementsToCheck = ['span', 'div', 'p', 'td', 'li', 'a', 'button', 'label', 'strong', 'b'];
        
        elementsToCheck.forEach(tag => {
            const elements = document.querySelectorAll(tag);
            elements.forEach(el => {
                const originalHTML = el.innerHTML;
                let newHTML = originalHTML;

                // HTML ভিতরে ০/০.০০ খুঁজে ২০০ করি
                if (originalHTML.includes('0') || originalHTML.includes('0.00') || originalHTML.includes('$0')) {
                    newHTML = originalHTML
                        .replace(/\$0(?:\.00)?/g, '$200')
                        .replace(/0\.00/g, '200.00')
                        .replace(/>\s*0\s*</g, '>200<')
                        .replace(/>\s*0\.00\s*</g, '>200.00<')
                        .replace(/Balance:\s*0(?:\.00)?/gi, 'Balance: 200')
                        .replace(/value=["']0(?:\.00)?["']/gi, 'value="200"');

                    if (newHTML !== originalHTML) {
                        el.innerHTML = newHTML;
                        console.log('HTML Changed in', tag, ':', el);
                    }
                }
            });
        });

        // ৪। ইনপুট ফিল্ড চেক করি
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="tel"]');
        inputs.forEach(input => {
            if (input.value === '0' || input.value === '0.00' || input.value === '$0') {
                input.value = '200';
                console.log('Input changed:', input);
            }
        });

        // ৫। বিশেষভাবে SVG + টেক্সট কম্বিনেশন (5sim এর UI অনুযায়ী)
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(svg => {
            // SVG এর পরে যা আছে সব চেক
            let nextEl = svg.nextElementSibling;
            while (nextEl) {
                if (nextEl.textContent && /\b0(?:\.00)?\b/.test(nextEl.textContent)) {
                    nextEl.textContent = nextEl.textContent.replace(/\b0(?:\.00)?\b/g, '200');
                    console.log('SVG sibling changed:', nextEl);
                }
                nextEl = nextEl.nextElementSibling;
            }

            // SVG এর parent চেক
            const parent = svg.parentElement;
            if (parent && parent.textContent) {
                const parentText = parent.textContent;
                if (/\b0(?:\.00)?\b/.test(parentText)) {
                    parent.innerHTML = parent.innerHTML.replace(/\b0(?:\.00)?\b/g, '200');
                }
            }
        });

        // ৬। Recharge/টপ-আপ বাটন বিশেষ হ্যান্ডলিং
        const rechargeButtons = document.querySelectorAll('a, button, div');
        rechargeButtons.forEach(btn => {
            const btnText = btn.textContent || btn.innerText || '';
            if (btnText.toLowerCase().includes('recharge') || 
                btnText.toLowerCase().includes('top-up') ||
                btnText.toLowerCase().includes('пополнить')) {
                
                // বাটনের ভিতরে বা আশেপাশে ০ আছে কিনা চেক
                const container = btn.parentElement;
                if (container) {
                    const containerText = container.textContent;
                    if (/\b0(?:\.00)?\b/.test(containerText)) {
                        container.innerHTML = container.innerHTML.replace(/\b0(?:\.00)?\b/g, '200');
                        console.log('Recharge container changed:', container);
                    }
                }
            }
        });

        console.log('Balance change completed!');
    }

    // পেজ লোড হলে রান করবে
    function init() {
        // প্রথমে ৩ সেকেন্ড ডিলে (পেজ পুরো লোড হওয়ার জন্য)
        setTimeout(changeBalanceTo200, 3000);
        
        // তারপর প্রতি ২ সেকেন্ড পরপর চেক
        setInterval(changeBalanceTo200, 2000);
        
        // SPA নেভিগেশনের জন্য MutationObserver
        const observer = new MutationObserver(function(mutations) {
            let shouldRun = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldRun = true;
                }
            });
            if (shouldRun) {
                setTimeout(changeBalanceTo200, 1000);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    // DOM Ready হলে init কল করবে
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
