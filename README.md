# LinkedIn Post Generator Chrome Extension

A Chrome extension that generates professional LinkedIn posts using OpenAI's GPT-3.5-turbo model. Simply enter a prompt, generate a post, and inject it directly into LinkedIn's post composer.

## Features

- 🤖 **AI-Powered Content Generation**: Uses OpenAI's GPT-3.5-turbo to create engaging LinkedIn posts
- 🔐 **Secure API Key Storage**: Safely stores your OpenAI API key using Chrome's storage API
- ✍️ **Smart Content Injection**: Automatically finds and fills LinkedIn's post composer
- 🎨 **Professional UI**: Clean, LinkedIn-inspired design with dark mode support
- ⚡ **Real-time Generation**: Fast post generation with loading indicators
- 📝 **Editable Output**: Edit generated posts before posting to LinkedIn

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The LinkedIn Post Generator icon should appear in your Chrome toolbar

### Requirements

- Google Chrome browser
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))

## Usage

### Setup
1. Click the extension icon in your Chrome toolbar
2. Enter your OpenAI API key in the provided field
3. Click "Save" to store your API key securely

### Generating Posts
1. Navigate to [LinkedIn](https://www.linkedin.com)
2. Click the extension icon
3. Enter a prompt describing what you want to post about
4. Click "Generate Post"
5. Review and edit the generated content if needed
6. Click "Post to LinkedIn" to inject the content into LinkedIn's composer
7. Publish your post on LinkedIn as usual

### Example Prompts
- "Share insights about remote work productivity"
- "Discuss the latest trends in artificial intelligence"
- "Write about career development tips"
- "Share thoughts on industry networking"

## File Structure

```
linkedin_post_generator/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Main extension logic
├── popup.css             # Styling for the popup
├── content.js            # LinkedIn page interaction script
├── images/
│   ├── icon.png          # Extension icon
│   └── icon.svg          # Vector icon source
└── README.md             # This file
```

## Technical Details

### Permissions
- `storage`: To securely store the OpenAI API key
- `activeTab`: To interact with the current LinkedIn tab
- `https://www.linkedin.com/*`: Host permission for LinkedIn integration

### API Integration
- Uses OpenAI's Chat Completions API with GPT-3.5-turbo
- Implements professional system prompts for LinkedIn-appropriate content
- Handles API errors gracefully with user feedback

### Content Injection
- Multiple selector strategies to find LinkedIn's post composer
- Handles both old and new LinkedIn interface designs
- Automatic fallback mechanisms for different page states
- Visual feedback when content is successfully injected

## Configuration

### OpenAI API Settings
The extension uses the following OpenAI API parameters:
- Model: `gpt-3.5-turbo`
- Max tokens: `500`
- Temperature: `0.7`

### Supported LinkedIn Pages
- LinkedIn homepage feed
- Company pages
- Profile pages
- Any page with LinkedIn's post composer

## Troubleshooting

### Common Issues

**"Please enter your OpenAI API key"**
- Ensure you've entered a valid OpenAI API key
- Check that the API key has sufficient credits
- Verify the API key hasn't expired

**"Error generating post"**
- Check your internet connection
- Verify your OpenAI API key is correct
- Ensure you have available API credits

**"Please navigate to LinkedIn first"**
- Make sure you're on a LinkedIn page (linkedin.com)
- Refresh the LinkedIn page and try again

**"Error inserting post"**
- Refresh the LinkedIn page
- Make sure LinkedIn's post composer is visible
- Try clicking "Start a post" on LinkedIn first

### API Key Security
- API keys are stored locally using Chrome's secure storage
- Keys are never transmitted except to OpenAI's servers
- Clear your browser data to remove stored keys

## Development

### Building from Source
No build process required - this is a vanilla JavaScript extension.

### Testing
1. Load the extension in developer mode
2. Open browser developer tools to view console logs
3. Test on various LinkedIn page types

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on different LinkedIn page layouts
5. Submit a pull request

## Privacy & Security

- **API Key Storage**: Stored locally using Chrome's secure storage API
- **No Data Collection**: The extension doesn't collect or transmit user data
- **OpenAI Integration**: Generated content is processed by OpenAI according to their privacy policy
- **LinkedIn Integration**: Only interacts with LinkedIn's post composer when explicitly requested

## License

This project is provided as-is for educational and personal use.

## Disclaimer

This extension is not affiliated with LinkedIn or OpenAI. Use responsibly and in accordance with both platforms' terms of service.

## Version History

### v1.0.0
- Initial release
- OpenAI GPT-3.5-turbo integration
- LinkedIn content injection
- Secure API key storage
- Professional UI design

## Support

For issues and feature requests, please check the troubleshooting section above or review the code for customization options.