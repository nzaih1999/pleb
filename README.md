# RenderCon Social Cards 2024

This is the official RenderCon Nairobi custom social cards ticket generation project, inspired by Next.js Conf 2024. Powered by Vercel's new Generative UI architecture and Meta's Llama 3.3, it streams React components from a large language model using React Server Components.

## Features

- **Generative UI**: Leverages Vercel's Generative UI to stream React components from a large language model.
- **Llama 3.3 Integration**: Utilizes Meta's Llama 3.3 model for natural language processing.
- **Easy Deployment**: Ready for deployment on Vercel or other hosting platforms.

## Tech Stack

- **Framework**: Next.js
- **UI**: Generative UI
- **AI Model**: Meta's Llama 3.3
- **Styling**: Tailwind CSS
- **Backend**: Next.js Server Actions
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   git clone https://github.com/rendercon/social.rendercon.org

2. Navigate to the project directory:

   cd social.rendercon.org

3. Install dependencies:

   npm install

4. Create a `.env.local` file and add the following variables:

   ```env
   ROQ_API_KEY=""
   GOOGLE_API_KEY=""
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   DATABASE_URL=
   ```

### Development

Start the development server:

npm run dev

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

1. Build the application:

   npm run build

2. Start the production server:

   npm start

### Deployment

Deploy the app to Vercel:

vercel deploy

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.

2. Create a new branch:

   git checkout -b feature/your-feature-name

3. Make your changes and commit them:

   git commit -m "Add your message here"

4. Push your branch:

   git push origin feature/your-feature-name

5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or suggestions, feel free to open an issue or reach out at [nzaih18@gmail.com](mailto:nzaih18@gmail.com).
