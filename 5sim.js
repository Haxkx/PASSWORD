// ==UserScript==
// @name         Permanent Balance 200 Changer
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Always show 200 balance in English on all pages
// @author       You
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    
    // স্টাইল এড করছি যাতে সংখ্যাগুলো স্পষ্ট দেখা যায়
    GM_addStyle(`
        [data-balance-changed="true"] {
            color: #ff0000 !important;
            font-weight: bold !important;
        }
    `);
    
    // স্থায়ীভাবে চেঞ্জ করা এলিমেন্ট ট্র্যাক রাখার জন্য
    const changedElements = new Set();
    
    // ব্যালেন্স টেক্সট চেঞ্জ করার ফাংশন
    function changeBalanceText() {
        // সব টেক্সট নোড প্রসেস করি
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // খালি টেক্সট স্কিপ করি
                    if (!node.textContent.trim()) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );
        
        let node;
        const patterns = [
            // ইন্টারন্যাশনাল প্যাটার্ন
            /\$\s*0(?:\.0+)?\b/i,                // $0
            /\b0\s*(?:USD|BDT|TK|৳|₹|€|£)/i,      // 0 USD
            /\bBalance:\s*0(?:\.0+)?\b/i,        // Balance: 0
            /\bBal:\s*0(?:\.0+)?\b/i,            // Bal: 0
            /\bAvailable:\s*0(?:\.0+)?\b/i,      // Available: 0
            /\bCurrent\s+Balance:\s*0(?:\.0+)?\b/i,
            
            // বাংলা প্যাটার্ন
            /\bব্যালেন্স:\s*০+\b/,
            /\bব্যালেন্স\s*=\s*০+\b/,
            /\bজমা:\s*০+\b/,
            /\bঅবশিষ্ট:\s*০+\b/,
            
            // শুধু সংখ্যা (তবে শুধু ০ বা ০.০০)
            /\b0(?:\.00)?\b/,
            /\b০+\b/
        ];
        
        while (node = walker.nextNode()) {
            // ইতিমধ্যে চেঞ্জ করা এলিমেন্ট স্কিপ করি
            if (changedElements.has(node)) continue;
            
            let originalText = node.textContent;
            let newText = originalText;
            
            // সব প্যাটার্ন চেক করি
            patterns.forEach(pattern => {
                if (pattern.test(originalText)) {
                    // রিপ্লেস করি
                    newText = originalText.replace(/\b0(?:\.00)?\b/g, '200')
                                         .replace(/\b০+\b/g, '200')
                                         .replace(/\$0/, '$200')
                                         .replace(/0\s*(USD|BDT|TK|৳|₹|€|£)/i, '200 $1')
                                         .replace(/Balance:\s*0/i, 'Balance: 200')
                                         .replace(/Bal:\s*0/i, 'Bal: 200')
                                         .replace(/ব্যালেন্স:\s*০+/g, 'ব্যালেন্স: 200')
                                         .replace(/ব্যালেন্স\s*=\s*০+/g, 'ব্যালেন্স = 200');
                }
            });
            
            // টেক্সট চেঞ্জ হয়েছে কিনা চেক
            if (newText !== originalText) {
                node.textContent = newText;
                
                // প্যারেন্ট এলিমেন্টে ডাটা এট্রিবিউট সেট করি
                if (node.parentNode && node.parentNode.nodeType === Node.ELEMENT_NODE) {
                    node.parentNode.setAttribute('data-balance-changed', 'true');
                }
                
                changedElements.add(node);
                console.log('ব্যালেন্স চেঞ্জ করা হয়েছে:', originalText, '→', newText);
            }
        }
        
        // বিশেষভাবে Recharge এর ব্যালেন্স চেঞ্জ করি
        const rechargeElements = document.querySelectorAll('*');
        rechargeElements.forEach(element => {
            if (changedElements.has(element)) return;
            
            const text = element.textContent || element.innerText || '';
            if (text.includes('Recharge') || text.includes('RECHARGE') || text.includes('recharge')) {
                // এর child বা sibling এ ০ খুঁজি
                const children = element.children;
                for (let child of children) {
                    if (child.textContent.trim() === '0' || 
                        child.textContent.trim() === '০' ||
                        child.textContent.trim() === '$0') {
                        child.textContent = '200';
                        child.setAttribute('data-balance-changed', 'true');
                        changedElements.add(child);
                    }
                }
                
                // sibling চেক
                let sibling = element.nextSibling;
                while (sibling) {
                    if (sibling.nodeType === Node.ELEMENT_NODE && 
                        (sibling.textContent.trim() === '0' || 
                         sibling.textContent.trim() === '০' ||
                         sibling.textContent.trim() === '$0')) {
                        sibling.textContent = '200';
                        sibling.setAttribute('data-balance-changed', 'true');
                        changedElements.add(sibling);
                    }
                    sibling = sibling.nextSibling;
                }
            }
        });
        
        // সব সংখ্যা দেখানো এলিমেন্ট (span, div, p, td, etc.)
        const numericElements = document.querySelectorAll('span, div, p, td, li, a, button, label');
        numericElements.forEach(element => {
            if (changedElements.has(element)) return;
            
            const content = element.textContent.trim();
            const numericPatterns = [
                /^\$?0(?:\.00)?$/,
                /^০+$/,
                /^0\s*(?:USD|BDT|TK|৳|₹|€|£)?$/i
            ];
            
            for (let pattern of numericPatterns) {
                if (pattern.test(content)) {
                    // শুধু ০ বা ০.০০ থাকলে ২০০ করি
                    element.textContent = content.replace(/0|০/, '200').replace(/\$0/, '$200');
                    element.setAttribute('data-balance-changed', 'true');
                    changedElements.add(element);
                    break;
                }
            }
        });
    }
    
    // ইনিশিয়াল চেঞ্জ
    function initialChange() {
        console.log('🔄 ব্যালেন্স চেঞ্জার শুরু হচ্ছে...');
        changeBalanceText();
    }
    
    // পেজ লোড হওয়ার সাথে সাথে শুরু
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialChange);
    } else {
        initialChange();
    }
    
    // MutationObserver - DOM চেঞ্জ হলে আবার চেক করবে
    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldCheck = true;
            }
            if (mutation.type === 'characterData') {
                // টেক্সট চেঞ্জ হলে চেক করি
                if (!changedElements.has(mutation.target)) {
                    changeBalanceText();
                }
            }
        });
        
        if (shouldCheck) {
            setTimeout(changeBalanceText, 100);
        }
    });
    
    // পুরো ডকুমেন্ট অবজার্ভ করি
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false,
        characterDataOldValue: true
    });
    
    // টাইমআউট দিয়ে আবার চেক (SPA এর জন্য)
    setInterval(changeBalanceText, 2000);
    
    // পেজ আনলোড হওয়ার আগে পর্যন্ত চলবে
    window.addEventListener('beforeunload', function() {
        console.log('🔄 ব্যালেন্স চেঞ্জার আপডেট হচ্ছে...');
    });
    
    // URL চেঞ্জ হলে আপডেট করবে (SPA সাইটের জন্য)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                changedElements.clear(); // নতুন পেজের জন্য নতুন এলিমেন্ট
                changeBalanceText();
            }, 500);
        }
    }).observe(document, { subtree: true, childList: true });
    
    console.log('✅ পার্মানেন্ট ব্যালেন্স চেঞ্জার চালু হয়েছে! সব পেজে ব্যালেন্স 200 দেখাবে।');
})();
