# ServiceConnect

**ServiceConnect** is a platform that connects clients with skilled labor workers (carpenters, plumbers, electricians) in Muzaffarnagar and Meerut. Our goal is to make finding reliable and affordable services easy, while ensuring transparency and trust.

## Features

- **Easy Access**: Find skilled workers effortlessly.
- **Trust & Transparency**: Guaranteed work completion and clear payment processes.
- **Empowering Workers**: Increased opportunities for skilled professionals.

## Tech Stack

- **Backend**: Node.js with raw SQL (`pg` for PostgreSQL)
- **Frontend**: React.js
- **Database**: PostgreSQL

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/serviceconnect.git
    cd serviceconnect
    ```

2. **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```
    DB_URI=postgres://username:password@localhost:5432/serviceconnect
    ```

3. **Install dependencies:**
    ```bash
    npm install
    ```

4. **Run the server:**
    ```bash
    npm start
    ```

5. **Set up the database:**
    Run your SQL migration scripts to set up the database schema.

## Usage

- **Client Side**: Users can browse and book services.
- **Worker Side**: Workers can list their services and manage bookings.

## Contributing

We welcome contributions! Please fork the repository and submit a pull request with your changes.
