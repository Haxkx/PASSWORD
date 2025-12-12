// ==UserScript==
// @name         Balance Changer to 200
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change balance to 200 on any website
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // ফাংশন ব্যালেন্স টেক্সট খুঁজে বের করে চেঞ্জ করবে
    function changeBalance() {
        // সব টেক্সট নোডের মধ্যে সার্চ করবে
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        while (node = walker.nextNode()) {
            // যদি টেক্সটে "Recharge" থাকে এবং তার পরের span এ সংখ্যা থাকে
            if (node.textContent.includes('Recharge')) {
                // পরবর্তী এলিমেন্ট চেক করি
                let parent = node.parentNode;
                if (parent) {
                    // সব sibling চেক করি
                    let nextSibling = parent.nextSibling;
                    while (nextSibling) {
                        if (nextSibling.nodeType === Node.ELEMENT_NODE && 
                            nextSibling.tagName === 'SPAN' && 
                            /^\d+$/.test(nextSibling.textContent.trim())) {
                            nextSibling.textContent = '200';
                            console.log('ব্যালেন্স ২০০ করা হয়েছে!');
                            return;
                        }
                        nextSibling = nextSibling.nextSibling;
                    }
                }
            }
            
            // অন্য সাধারণ প্যাটার্নগুলোর জন্য
            const balancePatterns = [
                /Balance:?\s*\$?\d+/i,
                /ব্যালেন্স:?\s*\$?\d+/i,
                /ব্যালেন্স\s*=\s*\d+/i,
                /Recharge.*\$?\d+/i,
                /\$\d+/
            ];
            
            for (let pattern of balancePatterns) {
                if (pattern.test(node.textContent)) {
                    // সংখ্যা খুঁজে বের করে ২০০ দিয়ে রিপ্লেস করি
                    node.textContent = node.textContent.replace(/\$\d+/, '$২০০');
                    node.textContent = node.textContent.replace(/\b\d+\b/, '২০০');
                    console.log('ব্যালেন্স আপডেট করা হয়েছে:', node.textContent);
                }
            }
        }
        
        // SVG এর পরের টেক্সট চেক করা
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(svg => {
            let nextNode = svg.nextSibling;
            while (nextNode) {
                if (nextNode.nodeType === Node.TEXT_NODE && nextNode.textContent.trim().match(/^\d+$/)) {
                    nextNode.textContent = '২০০';
                    console.log('SVG এর পরের ব্যালেন্স ২০০ করা হয়েছে');
                    return;
                }
                nextNode = nextNode.nextSibling;
            }
        });
    }

    // পেজ লোড হওয়ার পর একবার রান করবে
    setTimeout(changeBalance, 2000);
    
    // DOM পরিবর্তন হলে আবার চেক করবে (SPA এজাক্স সাইটের জন্য)
    const observer = new MutationObserver(changeBalance);
    observer.observe(document.body, { childList: true, subtree: true });

})();
