# LEOverse

LEOverse is an interactive space mission simulator built with Next.js. It allows users to design space missions, manage budgets, select spacecraft components, and optimize their missions for long-term space sustainability.

## Features

* **Interactive Mission Builder:** Design spacecraft using realistic mission components.
* **Country Selection:** Choose from multiple countries, each with its own budget, strengths, and challenges.
* **Sustainability Index:** Evaluate and improve the long-term sustainability of each mission.
* **AI Assistant:** Receive mission guidance, component recommendations, and budget optimization tips.
* **Global Leaderboard:** Compare mission scores with other players.
* **Achievement System:** Unlock rewards by reaching mission milestones.
* **Responsive Design:** Use the application on desktop, tablet, and mobile devices.

## Tech Stack

* **Framework:** Next.js 14 using the App Router
* **Language:** JavaScript
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **State Management:** Zustand
* **HTTP Client:** Axios
* **Icons:** React Icons
* **Backend:** PHP
* **Database:** MySQL

## Getting Started

### Prerequisites

Before running the project, make sure you have:

* Node.js 18 or later
* npm
* The LEOverse PHP backend running
* A configured MySQL database

### Installation

1. Clone the repository and navigate to the frontend directory:

   ```bash
   git clone <repository-url>
   cd leoverse-frontend
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create or update the `.env.local` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost/leo
   NEXT_PUBLIC_AI_API_URL=
   ```

   Environment variables:

   * `NEXT_PUBLIC_API_URL`: Base URL of the PHP backend.
   * `NEXT_PUBLIC_AI_API_URL`: URL of the AI chatbot API. Leave it empty to use rule-based responses.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the application in your browser:

   ```text
   http://localhost:3000
   ```

## Available Scripts

```bash
npm run dev
```

Starts the application in development mode.

```bash
npm run build
```

Creates an optimized production build.

```bash
npm start
```

Runs the production build.

```bash
npm run lint
```

Checks the project for linting issues.

## Project Structure

```text
leoverse-frontend/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── country/
│   │   └── page.js
│   ├── budget/
│   │   └── page.js
│   ├── mission/
│   │   └── page.js
│   ├── result/
│   │   └── page.js
│   └── leaderboard/
│       └── page.js
├── components/
│   └── ChatBot.js
├── lib/
│   ├── api.js
│   ├── store.js
│   ├── data.js
│   └── utils.js
├── public/
├── .env.local
├── package.json
└── README.md
```

### Main Directories

* `app/`: Application pages and layouts using the Next.js App Router.
* `components/`: Reusable user-interface components.
* `lib/`: API utilities, application data, helper functions, and Zustand stores.
* `public/`: Static assets such as images and icons.

## Main Features

### Country Selection

Users can select from several participating countries, including:

* Oman
* United States
* India
* Japan
* United Arab Emirates

Each country has its own:

* Mission budget
* Strategic strengths
* Technical challenges
* Mission constraints

The country information is intended for gameplay and simulation purposes.

### Mission Builder

Users can select spacecraft components from four main categories.

#### Propulsion

Examples include:

* Ion thrusters
* Chemical rockets
* Solar sails

#### Communication

Examples include:

* X-band communication
* Laser communication systems

#### Power

Examples include:

* Solar panels
* Radioisotope thermoelectric generators
* Fuel cells

#### Structure

Examples include:

* Aluminum structures
* Carbon-fiber structures
* Inflatable structures

Each component can include:

* Cost
* Sustainability Index impact
* Description
* Technical specifications
* Advantages and limitations

### Sustainability Index

The Sustainability Index is a score from `0` to `100` that estimates the overall sustainability of a mission.

The score may consider:

* Selected components
* Budget efficiency
* Technology choices
* Resource usage
* Long-term mission impact

A higher score represents a more sustainable mission design.

### AI Assistant

The integrated chatbot provides contextual guidance throughout the mission-building process.

It can help users with:

* Component recommendations
* Mission planning
* Sustainability concepts
* Budget optimization
* Technical trade-offs

When an external AI API is not configured, the chatbot falls back to rule-based responses.

### Leaderboard

The leaderboard displays mission rankings based on Sustainability Index scores.

Users can:

* View top-performing missions
* Compare sustainability scores
* Track their position
* Review selected countries and mission results

## API Integration

The frontend communicates with the PHP backend through REST-style endpoints.

The base URL is configured using:

```env
NEXT_PUBLIC_API_URL=http://localhost/leo
```

### Mission Endpoints

| Method | Endpoint                              | Description                    |
| ------ | ------------------------------------- | ------------------------------ |
| `POST` | `/api/missions/create.php`            | Creates a new mission          |
| `POST` | `/api/missions/add_component.php`     | Adds a component to a mission  |
| `POST` | `/api/missions/complete.php`          | Completes and scores a mission |
| `GET`  | `/api/missions/get_user_missions.php` | Retrieves a user's missions    |

### Chat Endpoints

| Method | Endpoint                       | Description                 |
| ------ | ------------------------------ | --------------------------- |
| `POST` | `/api/chat/create_session.php` | Creates a chatbot session   |
| `POST` | `/api/chat/update_context.php` | Updates the chatbot context |

### Progress Endpoints

| Method | Endpoint                   | Description             |
| ------ | -------------------------- | ----------------------- |
| `POST` | `/api/progress/update.php` | Updates user progress   |
| `GET`  | `/api/progress/get.php`    | Retrieves user progress |

### Leaderboard Endpoint

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| `GET`  | `/get_leaderboard.php` | Retrieves global rankings |

## AI Chatbot Integration

### Configuration

Add the AI API URL to `.env.local`:

```env
NEXT_PUBLIC_AI_API_URL=https://your-ai-api.com/chat
```

Restart the development server after modifying environment variables.

### Expected Request Format

```json
{
  "message": "Which propulsion system should I choose?",
  "context": {
    "country": "Oman",
    "budget": 50000,
    "components": []
  }
}
```

### Expected Response Format

The chatbot accepts either of the following response properties:

```json
{
  "response": "An ion thruster may be suitable for this mission."
}
```

or:

```json
{
  "message": "An ion thruster may be suitable for this mission."
}
```

When `NEXT_PUBLIC_AI_API_URL` is not configured, the application uses built-in rule-based responses.

## Building for Production

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

The production application is available at:

```text
http://localhost:3000
```

## Customization

### Adding a Country

Edit `lib/data.js` and add a new country to the `COUNTRIES` object:

```javascript
export const COUNTRIES = {
  YourCountry: {
    code: "XX",
    name: "Your Country",
    flag: "🏁",
    budget: 100000,
    gdpPerCapita: 50000,
    challenges: ["Challenge 1", "Challenge 2"],
    strengths: ["Strength 1", "Strength 2"],
  },
};
```

Make sure the country code and object key are unique.

### Adding a Component

Edit `lib/data.js` and add the component to the appropriate category:

```javascript
export const COMPONENTS = {
  category_name: [
    {
      id: "unique_id",
      name: "Component Name",
      category: "category_name",
      cost: 15000,
      si_impact: 8.5,
      description: "Component description",
      specs: {
        spec1: "value1",
        spec2: "value2",
      },
    },
  ],
};
```

Make sure every component has a unique `id`.

### Customizing the Design

Depending on the project configuration, you can customize the application by editing:

* `app/globals.css` for global styles
* Tailwind CSS configuration for theme settings
* Individual component files for component-specific styling
* Framer Motion properties for animations

## Troubleshooting

### Backend Connection Issues

Confirm that the PHP backend is running and accessible:

```bash
curl http://localhost/leo/api/missions/create.php
```

Then verify:

* `NEXT_PUBLIC_API_URL` contains the correct backend URL.
* The PHP server is running.
* The MySQL database is available.
* The backend has the required CORS headers.
* The frontend and backend endpoint paths match.

### Environment Variables Not Updating

After changing `.env.local`, restart the development server:

```bash
npm run dev
```

Next.js does not automatically reload all environment variable changes.

### Build Errors

Delete the Next.js build cache and reinstall dependencies:

```bash
rm -rf .next node_modules
npm install
npm run dev
```

On Windows PowerShell, use:

```powershell
Remove-Item -Recurse -Force .next, node_modules
npm install
npm run dev
```

### State Is Not Persisting

Check that:

* Browser storage is enabled.
* Zustand persistence is configured correctly.
* The application is running in the browser rather than during server-side rendering.
* The stored state has not become incompatible after a data-model change.

To clear the stored state during development, open the browser console and run:

```javascript
localStorage.clear();
```

Then refresh the page.

### CORS Errors

Make sure the PHP backend permits requests from the frontend origin.

For local development, the frontend normally runs at:

```text
http://localhost:3000
```

The backend must also handle preflight `OPTIONS` requests where required.

## Performance

The application uses several performance optimizations:

* Next.js image optimization
* Reusable React components
* Client-side state persistence
* Optimized production builds
* GPU-accelerated animations
* API request reuse or caching where appropriate

## Browser Support

LEOverse is designed to support modern browsers, including:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari
* Chrome for Android
* Safari for iOS

Older browser versions may not support all application features.

## Contributing

1. Fork the repository.

2. Create a feature branch:

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. Commit your changes:

   ```bash
   git commit -m "Add amazing feature"
   ```

4. Push the branch:

   ```bash
   git push origin feature/amazing-feature
   ```

5. Open a pull request describing your changes.

## License

This project was developed as part of the NASA International Space Apps Challenge.

Add the appropriate license file before distributing or reusing the project outside the hackathon.

## Project Link
https://leoverse.netlify.app/
