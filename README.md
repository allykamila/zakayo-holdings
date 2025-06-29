# Zakayo Holdings Management System

## Project info

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

This project is configured for easy deployment on Netlify, a modern web hosting platform that offers continuous deployment, serverless functions, and global CDN distribution.

### Deploying to Netlify

#### Option 1: Netlify UI (Recommended for beginners)

1. Create a Netlify account if you don't have one at [netlify.com](https://www.netlify.com/)
2. Click on "New site from Git"
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select this repository
5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (Advanced) Environment variables: Add any required environment variables for your project
6. Click "Deploy site"
7. Wait for the build process to complete (you can view the build log in real-time)
8. Your site will be deployed to a URL like: `https://your-site-name.netlify.app`

#### Option 2: Using Netlify CLI

For developers who prefer working from the command line:

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. Login to your Netlify account:
   ```bash
   netlify login
   ```
3. Link your project to a Netlify site:
   ```bash
   netlify init
   ```
   This command will guide you through creating a new site or linking to an existing one.
4. Test your deployment locally:
   ```bash
   netlify build
   netlify dev
   ```
   This will build your project and run a local development server with Netlify's environment.
5. Deploy to production:
   ```bash
   netlify deploy --prod
   ```
6. After deployment, you can run:
   ```bash
   netlify open
   ```
   to view your live site.

### CI/CD with Netlify

One of Netlify's greatest advantages is Continuous Deployment. When set up:

1. Every push to your main/master branch will trigger an automatic deployment
2. Pull requests can generate "deploy previews" to test changes before merging
3. View build status and deploy logs directly in the Netlify dashboard

### Serverless Functions

This project includes a ready-to-use serverless function that you can access after deployment:

```
https://your-netlify-site.netlify.app/.netlify/functions/system-info
```

The function is located in `netlify/functions/system-info.js` and returns basic system information.

#### Creating More Functions

You can add more serverless functions by creating new JavaScript files in the `netlify/functions` directory.

Example of a simple function (`netlify/functions/hello-world.js`):

```javascript
exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Zakayo Holdings!" }),
  };
};
```

Access it after deployment at: `https://your-site.netlify.app/.netlify/functions/hello-world`

## Custom Domain Setup

Connecting your own domain name to your Netlify site is straightforward:

### Step 1: Add your custom domain

1. Go to your site's dashboard on Netlify
2. Navigate to `Site settings` > `Domain management`
3. Click `Add custom domain`
4. Enter your domain name (e.g., `zakayoholdings.com`) and click `Verify`
5. Select whether you want to add www subdomain as well

### Step 2: Configure DNS settings

**Option A: Using Netlify DNS (Recommended)**

1. In the Netlify dashboard, click `Set up Netlify DNS for example.com`
2. Follow the instructions to add the provided nameservers to your domain registrar
3. Wait for DNS propagation (can take up to 24-48 hours)

**Option B: Using your existing DNS provider**

1. Add a CNAME record pointing to your Netlify URL:
   - Type: `CNAME`
   - Name: `www` (or subdomain of choice)
   - Value: `your-site-name.netlify.app`
2. For the root domain, add either:
   - An ALIAS record pointing to `your-site-name.netlify.app`, or
   - An A record pointing to Netlify's load balancer IP addresses (provided in the Netlify dashboard)

### Step 3: SSL/HTTPS Setup

Netlify automatically provisions and renews SSL certificates for your custom domain through Let's Encrypt. This happens automatically after your DNS is configured correctly.

1. In your site's dashboard, go to `Site settings` > `HTTPS`
2. Ensure `Netlify managed certificate` is enabled
3. Wait for the certificate to be provisioned (usually within minutes)

### Best practices for domain management:

1. Enable `Force HTTPS` in the Netlify dashboard for better security
2. Set up redirects from `www` to non-www (or vice versa) for consistent SEO
3. Configure your primary domain to avoid duplicate content issues

### Deployment Convenience Scripts

This project includes several convenience scripts for Netlify deployment:

| Command                 | Description                                 |
| ----------------------- | ------------------------------------------- |
| `npm run deploy`        | Deploy to Netlify production environment    |
| `npm run deploy:draft`  | Create a draft deployment for preview       |
| `npm run netlify:dev`   | Run Netlify development environment locally |
| `npm run build:netlify` | Build the project for Netlify deployment    |

To use these commands, make sure you have the Netlify CLI installed and are logged in.
