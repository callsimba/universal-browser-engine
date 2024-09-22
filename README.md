# Universal Browser Compatibility Engine

The Universal Browser Compatibility Engine is a powerful tool designed to detect browser engines, apply necessary polyfills, and manage plugin features for cross-browser compatibility. It simplifies the process of handling browser-specific implementations and ensures smooth functionality across modern web browsers like Chrome, Firefox, Safari, Edge, and more.

## Features

- **Browser Engine Detection**: Identifies the underlying browser engine (Blink, Gecko, WebKit, Trident).
- **Polyfills Application**: Automatically applies necessary polyfills based on the detected browser engine.
- **Plugin Management**: Loads and applies browser and OS-specific plugins like Chrome-specific and Windows-specific features.
- **Dark Mode Detection**: Detects if the browser is running in dark mode.
- **Touch Device Detection**: Checks if the user is on a touch-capable device.
- **GPU Information Retrieval**: Gathers information about the user's GPU.
- **Secure Connection Detection**: Verifies whether the browser is running on a secure connection (HTTPS).
- **Browser Vulnerability Check**: Detects if the browser is outdated or vulnerable to certain exploits.
- **Network Speed Detection**: Determines the user's network speed.

## Installation

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

Clone the repository:
```bash
git clone https://github.com/callsimba/universal-browser-engine.git

 ## Navigate to the project directory:
 
 cd universal-browser-engine

## Install the required dependencies:
npm install




## Running Tests

This project uses Jest for unit testing. You can run the tests and check coverage using:
npm test

## To generate a test coverage report:
npm test -- --coverage 


## Folder Structure
├── src
│   ├── core
│   ├── detection
│   ├── plugins
│   ├── polyfills
│   └── utils
├── tests
│   ├── detection.test.js
│   ├── plugins.test.js
│   └── seleniumTest.js
├── .babelrc
├── .eslintrc.json
├── .prettierrc
├── package.json
├── README.md
└── index.js


## Contributing

If you wish to contribute to this project, feel free to fork the repository and submit a pull request. Ensure that your contributions are well-documented and include appropriate tests where necessary.

## License
This project is licensed under the MIT License -

## Contact

For any inquiries or issues, you can reach out via my Telegram:

- Telegram: @npx_react_native  
