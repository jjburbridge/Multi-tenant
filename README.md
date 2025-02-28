
## Configuration

### Step 1. Set up the environment

Duplicate the `.env.local.example` file, rename it to `.env.local` and add the environment variables needed to connect Next.js and the Studio to your Sanity project.

### Step 2. Run Next.js locally in development mode

```bash
npm install && npm run dev
```

When you run this development server, the changes you make in your frontend and studio configuration will be applied live using hot reloading.

Your site should be up and running on [http://localhost:3000][localhost-3000]!  - I have not made any changes for this based on the changes in the studio

You can access your Sanity Studios [http://localhost:3000/studio][localhost-3000-studio].
This will list all available workspaces for you. If your user only has access to just one Workspace that studio will be displayed.


There are 2 custom roles that I have created to show how workspaces can be filtered on by user roles:
 - `author`
 - `post`
This is applied in `generateConfig` in `sanity.config.ts`

Other workspaces are dynamically generated based on category Documents. 
see `categoryPostWorkspace` in `sanity.config.ts`
    
