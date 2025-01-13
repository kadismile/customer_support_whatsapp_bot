# Customer Support Whatsapp BOT

A brief description of what your project does and its purpose.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## Description

A simple Whatsapp bot that gives support to customers

## Installation

### Prerequisites

- Node.js
- npm or yarn
- postgresql (database)

### Steps to Install

1. Clone this repository:

   ```bash
   git clone https://github.com/kadismile/customer_support_whatsapp_bot.git
   ```

2. Navigate to the project directory:

   ```bash
   cd into customer_support_whatsapp_bot folder
   and run  npm install
   ```

3. Install front-end dependencies:

   ```bash
    cd into src/views and also run npm install && npm run build
   ```

4. Create a `.env` in root of customer_support_whatsapp_bot folder and add your environment variables. Also, Create a `.env` in the views root folder in the `src` directory. Both folders have a sample-env file replace the sample with your actual environment variables.

5. create and Run migrations
   ```bash
   RUN `npx prisma migrate dev --name init` and `npx prisma generate`
   ```

## Usage

### Running the Application

To start the application:

```bash
npm run dev
```

navigate to http://localhost:9000/authenticate (locally) or 
navigate to https://customer-support-whatsapp-bot-q77v.onrender.com/authenticate if you want to check it out online
to activate the bot add your email address and click the button to get a QR code(it will be slow on the live server due to free plan)

## Contact

you can reach me on

```bash
ikadismile@gmail.com
```
