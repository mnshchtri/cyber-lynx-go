# Cyber-LynX

A modern, responsive cybersecurity dashboard and workflow automation platform.

## Overview

Cyber-LynX is designed to streamline cybersecurity assessment and penetration testing workflows. It features a powerful visual workflow builder, an integrated terminal for direct system interaction, and comprehensive target management. The platform is built with a Go backend for high performance and a React frontend for a dynamic and responsive user experience.

## Features

### ✨ Core Functionality
- **Visual Workflow Builder:** Drag-and-drop interface to design and automate security assessment workflows.
- **Integrated Terminal:** A dedicated page for direct command-line interaction with the system.
- **Target Management:** Add, edit, and delete targets (websites, IPs, domains, subdomains) with user-specific isolation.
- **User Authentication:** Secure login and signup system.
- **Responsive Design:** Optimized for various devices, from desktop to mobile.
- **Modern UI/UX:** Clean, intuitive, and professional interface with smooth transitions and animations.
- **Light/Dark Mode:** Comprehensive theme support with persistence across sessions.

### 🚀 Workflow Automation
- Drag and drop tools onto the canvas to build custom workflows.
- Configure individual tool parameters.
- Connect tools to define execution flow.
- Save and load workflows for reusability.

### 💻 Terminal Access
- Execute commands directly from the web interface.
- View real-time command output.

## Technology Stack

### Backend
- **Go:** High-performance, concurrent backend services.
- **Gin Gonic:** Web framework for building APIs.
- **GORM:** ORM library for database interaction.
- **SQLite:** Lightweight, file-based database for development and local deployments.

### Frontend
- **React:** A JavaScript library for building user interfaces.
- **React Router DOM:** For declarative routing in React applications.
- **React Flow:** For building interactive node-based editors (workflow canvas).
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **Chart.js:** For data visualization on the dashboard.

## Installation

### Prerequisites

-   **Go:** [Install Go](https://golang.org/doc/install) (version 1.18 or higher recommended)
-   **Node.js & npm:** [Install Node.js](https://nodejs.org/en/download/) (which includes npm) (version 14 or higher recommended)
-   **Git:** [Install Git](https://git-scm.com/downloads)

### Setup Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cyber-lynx.git
    cd cyber-lynx
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    go mod tidy
    go run main.go # This will start the backend server
    ```
    The backend server will typically run on `http://localhost:8080`.

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    npm start # This will start the React development server
    ```
    The frontend development server will typically run on `http://localhost:3000`.

4.  **Access the Application:**
    -   Open your web browser and navigate to `http://localhost:3000`.
    -   Register a new account or log in if you already have one.

## Usage

### Dashboard

The dashboard provides an overview of your security assessment activities, including target statistics and recent activities.

### Workflow Builder

Navigate to the "Workflow" page to design your automation flows:
1.  **Add Tools:** Drag and drop tools from the sidebar onto the canvas.
2.  **Configure Tools:** Click on a tool node to open its configuration modal and set parameters.
3.  **Connect Tools:** Draw connections between tool nodes to define the execution order.
4.  **Save/Load:** Save your workflows to local storage or load previously saved ones.

### Terminal

Access the dedicated "Terminal" page from the sidebar to interact directly with the underlying system via a command-line interface.

## Contributing

We welcome contributions! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and ensure tests pass.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.