# Technical Context

## Technologies Used

### Core Framework
- **React**: Front-end library for building user interfaces
- **TypeScript**: Strongly typed programming language
- **Vite**: Modern build tool and development server

### Styling and UI
- **Tailwind CSS**: Utility-first CSS framework
- **HeadlessUI**: Unstyled, accessible UI components
- **Framer Motion**: Animation library for React
- **Lucide React**: Icon library
- **Recharts**: Composable charting library for React

### Routing
- **React Router**: Client-side routing library

### API Integrations
- **OpenAI SDK**: For interacting with OpenAI's GPT models
- **Google Generative AI SDK**: For interacting with Google's Gemini models
- **Anthropic SDK**: For interacting with Anthropic's Claude models

### Development Tools
- **ESLint**: Code linting
- **PostCSS**: CSS transformation tool
- **Autoprefixer**: Automatically adds vendor prefixes to CSS

## Development Setup

### Local Development
1. Clone the repository
2. Run `npm install` to install dependencies
3. Create API keys for desired AI providers
4. Run `npm run dev` to start the development server
5. Access the application at `http://localhost:5173`

### Build Process
1. Run `npm run build` to create a production build
2. The build output will be in the `dist` directory
3. Deploy the contents of the `dist` directory to a static web host

### Environment Requirements
- Node.js v16+
- npm v8+
- Modern browser (Chrome, Firefox, Safari, Edge)

## Technical Constraints

### Security Considerations
- API keys are stored in browser localStorage only (not on a server)
- No server-side processing or storage of user data
- Users must provide their own API keys

### Performance Considerations
- AI API calls can be slow (2-5 seconds per request)
- Large datasets may cause rendering performance issues
- Chart rendering can be resource-intensive

### Compatibility
- Modern browsers only (IE11 not supported)
- Responsive design for desktop and tablet (limited mobile optimization)

## Dependencies
The project has the following major dependencies:

### Production Dependencies
- `react` (v18.3.1): Core UI library
- `react-dom` (v18.3.1): React rendering for web
- `react-router-dom` (v7.0.2): Routing library
- `@anthropic-ai/sdk` (v0.32.1): Anthropic Claude API client
- `@google/generative-ai` (v0.21.0): Google Generative AI API client
- `openai` (v4.76.1): OpenAI API client
- `@headlessui/react` (v2.2.0): Unstyled UI components
- `recharts` (v2.14.1): Charting library
- `framer-motion` (v11.13.5): Animation library
- `lucide-react` (v0.344.0): Icon library

### Development Dependencies
- `typescript` (v5.5.3): TypeScript language
- `vite` (v5.4.2): Build tool
- `@vitejs/plugin-react` (v4.3.1): React plugin for Vite
- `tailwindcss` (v3.4.1): CSS framework
- `eslint` (v9.9.1): Linting tool
- `typescript-eslint` (v8.3.0): TypeScript ESLint integration
- `eslint-plugin-react-hooks` (v5.1.0-rc.0): React hooks linting
- `eslint-plugin-react-refresh` (v0.4.11): React refresh linting

## External Services

### OpenAI API
- Provides GPT-4 model for most advanced language processing
- Can handle complex, nuanced keyword research
- Higher cost per API call

### Google Generative AI
- Provides Gemini Pro model for language processing
- Good balance of performance and cost
- Integrated with Google's knowledge graph

### Anthropic API
- Provides Claude model for language processing
- Known for detailed, well-structured responses
- Competitive pricing for enterprise use 