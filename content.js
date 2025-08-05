// Content script for LinkedIn Post Generator
(function() {
    'use strict';

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'insertPost') {
            const success = insertPostContent(request.content);
            sendResponse({success: success});
        }
    });

    function insertPostContent(content) {
        try {
            // Try multiple selectors for LinkedIn post composer
            const selectors = [
                // New LinkedIn interface
                'div[data-testid="share-box-text-editor-placeholder"]',
                'div[data-testid="share-box-text-editor"]',
                // Fallback selectors
                '.ql-editor[contenteditable="true"]',
                'div[contenteditable="true"][role="textbox"]',
                // Share box selectors
                'div[data-placeholder*="share"][contenteditable="true"]',
                'div[data-placeholder*="thoughts"][contenteditable="true"]',
                // Generic contenteditable areas that might be post composers
                'div.ql-editor',
                'div[contenteditable="true"]'
            ];

            let targetElement = null;

            // Try each selector until we find a visible element
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    // Check if element is visible and likely a post composer
                    if (element.offsetParent !== null && 
                        element.offsetHeight > 50 && 
                        element.offsetWidth > 200) {
                        targetElement = element;
                        break;
                    }
                }
                if (targetElement) break;
            }

            // If no post composer found, try to click "Start a post" button first
            if (!targetElement) {
                const startPostSelectors = [
                    'button[data-testid="share-box-open"]',
                    'button:contains("Start a post")',
                    '.share-box-feed-entry__trigger',
                    '[data-control-name="share_box_open"]'
                ];

                for (const selector of startPostSelectors) {
                    const button = document.querySelector(selector);
                    if (button && button.offsetParent !== null) {
                        button.click();
                        // Wait for the composer to appear
                        setTimeout(() => {
                            insertPostContent(content);
                        }, 1000);
                        return true;
                    }
                }
            }

            if (!targetElement) {
                console.error('Could not find LinkedIn post composer');
                return false;
            }

            // Clear existing content
            targetElement.textContent = '';
            targetElement.innerHTML = '';

            // Insert the new content
            if (targetElement.tagName.toLowerCase() === 'textarea') {
                targetElement.value = content;
                targetElement.dispatchEvent(new Event('input', {bubbles: true}));
            } else {
                // For contenteditable divs
                targetElement.textContent = content;
                
                // Trigger various events to ensure LinkedIn recognizes the change
                const events = ['input', 'keyup', 'change', 'blur'];
                events.forEach(eventType => {
                    targetElement.dispatchEvent(new Event(eventType, {bubbles: true}));
                });

                // Try to set innerHTML as fallback
                if (!targetElement.textContent) {
                    targetElement.innerHTML = content.replace(/\n/g, '<br>');
                }
            }

            // Focus the element
            targetElement.focus();

            // Scroll into view
            targetElement.scrollIntoView({behavior: 'smooth', block: 'center'});

            // Add visual indication
            targetElement.style.border = '2px solid #0077b5';
            setTimeout(() => {
                targetElement.style.border = '';
            }, 2000);

            return true;

        } catch (error) {
            console.error('Error inserting post content:', error);
            return false;
        }
    }

    // Helper function to wait for element to appear
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

})();