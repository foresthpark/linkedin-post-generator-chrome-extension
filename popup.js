document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyBtn = document.getElementById('saveApiKey');
    const promptInput = document.getElementById('prompt');
    const generateBtn = document.getElementById('generateBtn');
    const generatedPostTextarea = document.getElementById('generatedPost');
    const outputSection = document.getElementById('outputSection');
    const postBtn = document.getElementById('postBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const loading = document.getElementById('loading');
    const status = document.getElementById('status');

    // Load saved API key
    chrome.storage.sync.get('openaiApiKey', function(result) {
        if (result.openaiApiKey) {
            apiKeyInput.value = result.openaiApiKey;
        }
    });

    // Save API key
    saveApiKeyBtn.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            chrome.storage.sync.set({openaiApiKey: apiKey}, function() {
                showStatus('API key saved successfully!', 'success');
            });
        } else {
            showStatus('Please enter a valid API key', 'error');
        }
    });

    // Generate post
    generateBtn.addEventListener('click', async function() {
        const prompt = promptInput.value.trim();
        const apiKey = apiKeyInput.value.trim();

        if (!prompt) {
            showStatus('Please enter a prompt', 'error');
            return;
        }

        if (!apiKey) {
            showStatus('Please enter your OpenAI API key', 'error');
            return;
        }

        try {
            loading.style.display = 'block';
            outputSection.style.display = 'none';
            status.textContent = '';

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional LinkedIn content creator. Generate engaging, professional LinkedIn posts that are informative, authentic, and encourage engagement. Keep posts concise but valuable. Use appropriate hashtags and maintain a professional tone.'
                        },
                        {
                            role: 'user',
                            content: `Create a LinkedIn post about: ${prompt}`
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const generatedPost = data.choices[0].message.content.trim();

            generatedPostTextarea.value = generatedPost;
            loading.style.display = 'none';
            outputSection.style.display = 'block';

        } catch (error) {
            loading.style.display = 'none';
            showStatus(`Error generating post: ${error.message}`, 'error');
        }
    });

    // Post to LinkedIn
    postBtn.addEventListener('click', function() {
        const generatedPost = generatedPostTextarea.value.trim();
        
        if (!generatedPost) {
            showStatus('No post to share', 'error');
            return;
        }

        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tab = tabs[0];
            
            if (!tab.url.includes('linkedin.com')) {
                showStatus('Please navigate to LinkedIn first', 'error');
                return;
            }

            chrome.tabs.sendMessage(tab.id, {
                action: 'insertPost',
                content: generatedPost
            }, function(response) {
                if (chrome.runtime.lastError) {
                    showStatus('Error: Please refresh the LinkedIn page and try again', 'error');
                } else if (response && response.success) {
                    showStatus('Post inserted successfully! You can now publish it on LinkedIn.', 'success');
                    window.close();
                } else {
                    showStatus('Error inserting post. Make sure you are on a LinkedIn page with a post composer.', 'error');
                }
            });
        });
    });

    // Cancel
    cancelBtn.addEventListener('click', function() {
        outputSection.style.display = 'none';
        promptInput.value = '';
        generatedPostTextarea.value = '';
        status.textContent = '';
    });

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type}`;
        setTimeout(() => {
            status.textContent = '';
            status.className = 'status';
        }, 5000);
    }
});