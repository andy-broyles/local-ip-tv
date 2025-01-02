# Local IP TV

Local IP TV is a web application that allows you to view and manage live camera feeds using IP or RTSP streams. It supports features like dark mode, fullscreen viewing, and local storage for saving camera configurations.

---

## Features

- **Add Camera Feeds**: Supports HTTP and RTSP streams.
- **Fullscreen Mode**: View camera feeds in fullscreen with a single click.
- **Dark Mode Toggle**: Switch between light and dark themes.
- **Persistent Storage**: Saves camera configurations in local storage.

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or later)
- **npm** or **yarn**

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/andy-broyles/local-ip-tv.git
   cd local-ip-tv
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Start the Development Server**:

   ```bash
   npm run dev
   ```

4. Open the application in your browser at:
   ```
   http://localhost:5173
   ```

---

## Usage

1. Enter a valid **IP camera URL** or **RTSP stream URL** in the input box.
2. Click **Add Camera** to view the feed.
3. Click on a feed to enter **fullscreen mode**.
4. Use the **Remove** button to delete a feed.
5. Toggle between **light and dark mode** using the button in the navbar.

---

## Technologies Used

- **React** - Frontend framework.
- **JSMpeg** - RTSP video streaming support.
- **Vite** - Development server and build tool.

---

# Folder Structure

```
local-ip-tv/
├── backend/                     # Backend code
│   ├── controllers/            # Backend controllers
│   └── routes/                 # Backend routes
├── frontend/                    # Frontend code
│   ├── config/                  # Configuration files
│   ├── public/                  # Static assets
│   ├── src/                     # Source code for React components
│   │   ├── assets/              # Images and static assets
│   │   ├── components/          # React components
│   │   ├── pages/               # Page-level components
│   │   ├── styles/              # CSS or stylesheets
│   │   └── utils/               # Utility functions
├── .gitignore                   # Git ignore rules
├── LICENSE                      # License file
└── README.md                    # Project documentation
```

---

## License

This project is licensed under the **MIT License**. See the LICENSE file for details.

---

## Contributing

Contributions are welcome! Submit a pull request or open an issue to propose changes.

---

## Author

**Andy Broyles**

- GitHub: [andy-broyles](https://github.com/andy-broyles)

---

## Future Enhancements

- Add support for **WebRTC** streaming.
- Implement **grid layouts** for larger video walls.
- Support **multi-user authentication**.

---
