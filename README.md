# Code-App

## Overview

Code-App is a real-time coding platform for collaborative learning and sharing of code snippets.

## Key Features:

- Real-time, shared code editor: Whether you are a student or a mentor, you can access and interact with the same code simultaneously.
- Mentor and student roles: The first user who accesses a code block is a mentor and has read access to the code. All the others considered students, who can also edit the code.
- Code tracking: The application checks if the written code matches the solution. If it does, a success message and smiley are displayed.
- Code reset: "Reset" button that enables you to reset the database back to its initial state whenever necessary.

## Technologies

• React.js
• Node.js Express
• CSS
• Socket.IO
• MongoDB
• Ace Editor

## Deployment

The client is deployed on Netlify and accessible through the following URL: https://moveo-yuval.netlify.app/

The server is deployed on Heroku.

## Known Issues & Future Improvements

1. User roles: Currently, all users who enter the site after the first user (mentor) are marked as students.
2. Reset functionality: To reset the database to its initial state, users must manually press the "Reset" button. In the future, we aim to automate this process and make it more intuitive.
