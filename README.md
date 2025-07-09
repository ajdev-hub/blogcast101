# Blogcast: Deployed on Cloudflare

This is a modern podcast discovery application built with React and powered by the Google Gemini API. The entire stack is designed to be deployed on Cloudflare's developer platform for unparalleled performance, security, and scalability.

## Architecture Overview

This project uses a decoupled, serverless architecture:

-   **Frontend**: A React single-page application hosted on **Cloudflare Pages**. This provides lightning-fast static asset delivery across Cloudflare's global edge network.
-   **Backend**: A **Cloudflare Worker** acts as a secure API gateway. The frontend communicates with this Worker, which then securely calls the Google Gemini API. This ensures the API key is never exposed to the client browser.
-   **Caching**: **Cloudflare KV** is used as a high-performance cache to store the results from the Gemini API. This reduces API costs and provides near-instantaneous load times for subsequent user visits.
-   **Secrets**: The Google Gemini API key is securely stored using **Cloudflare Secrets** and is only accessible by the backend Worker.

## Tech Stack

-   **UI Framework**: React
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`gemini-2.5-flash`)
-   **Platform**: Cloudflare (Pages, Workers, KV, Secrets)

---

## Local Development

Follow these steps to set up and run the project locally. This setup uses Wrangler to simulate the Cloudflare production environment.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v18.0 or later)
-   [npm](https://www.npmjs.com/)
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up).

### 2. Installation

First, install the project dependencies, including the Cloudflare `wrangler` CLI:

```bash
npm install
```

### 3. Set Up Local Secrets

The project needs your Google Gemini API key to function. Wrangler uses a `.dev.vars` file for local development secrets.

Create a file named `.dev.vars` in the root of the project and add your API key:

**.dev.vars**
```
API_KEY="your_gemini_api_key_here"
```
> **Note:** The `.gitignore` file is configured to prevent `.dev.vars` from ever being committed to source control.

### 4. Run the Development Server

Start the local development server using the `wrangler` CLI. This command builds the frontend, starts a local server, and simulates the Worker and KV environment.

```bash
npx wrangler pages dev dist
```
Your application should now be running at `http://localhost:8788`. Wrangler will automatically rebuild and reload the app when you make changes to either the frontend (`./*`) or backend (`./functions/*`) code.

---

## Deployment to Cloudflare

Deploying this project is a streamlined process handled by Wrangler.

### 1. One-Time Setup on Cloudflare Dashboard

Before your first deployment, you need to create a KV namespace and set your production API key secret.

**A. Create a KV Namespace:**

Run the following command to create a KV namespace for caching. Replace `blogcast-cache` with your preferred name.

```bash
npx wrangler kv:namespace create "PODCAST_CACHE"
```

This will output an `id` and a `preview_id`.

**B. Update `wrangler.toml`:**

Open your `wrangler.toml` file and uncomment/add the `kv_namespaces` binding using the IDs from the previous step. It should look like this:

```toml
[[kv_namespaces]]
binding = "PODCAST_CACHE"
id = "<the-id-you-received>"
preview_id = "<the-preview-id-you-received>"
```

**C. Set Production Secret:**

Run the following command to securely store your Gemini API key. Wrangler will prompt you to enter the secret value, which will be encrypted and stored securely on Cloudflare.

```bash
npx wrangler secret put API_KEY
```

### 2. Deploy the Project

Once the one-time setup is complete, deploy your application by running:

```bash
npx wrangler pages deploy dist
```

Wrangler will build your React app, bundle your Worker function, and deploy everything to Cloudflare's global network. You will be given a unique `.pages.dev` URL where your live application can be accessed.
