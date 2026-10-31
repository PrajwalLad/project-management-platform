# Flowspace local development

## PostgreSQL GUI

Use **pgAdmin 4**. It is the closest PostgreSQL equivalent to MongoDB Compass: it lets you browse databases and tables, inspect rows, and run SQL.

On Windows, the PostgreSQL installer linked from the [official PostgreSQL Windows download page](https://www.postgresql.org/download/windows/) includes both the PostgreSQL server and pgAdmin. During installation, remember the password you choose for the **postgres** user.

In pgAdmin:

1. Expand **Servers** and connect to the local server (usually on port **5432**).
2. Right-click **Databases** → **Create** → **Database...**
3. Name it **real_time_project_mgmt** and save.

## App connection

In the **backend** folder, copy **.env.example** to **.env**. Replace **YOUR_POSTGRES_PASSWORD** with the password chosen during installation. Set **JWT_SECRET** to a private random value. You can generate one with:

    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

Then start the API:

    cd backend
    npm run dev

On startup, the API reads **db/schema.sql**, creates the **users** table if needed, and checks the connection. The React app proxies **/api** requests to Express during development, so start it in a second terminal:

    cd frontend
    npm run dev

Open the Vite URL, create an account, then use the sign-in form on later visits. The account is stored in PostgreSQL. The session is a signed JWT in an **HttpOnly** cookie; frontend JavaScript cannot read the cookie.

## MongoDB / Mongoose translation

| MongoDB + Mongoose | This project with PostgreSQL |
| --- | --- |
| Database | PostgreSQL database |
| Collection | Table |
| Document | Row |
| Mongoose schema/model | SQL table definition in **db/schema.sql** |
| ObjectId | **users.id** (**BIGINT**) |
| **User.create({...})** | **INSERT INTO users (...) VALUES ($1, ...)** |
| **User.findOne({ email })** | **SELECT ... FROM users WHERE email = $1** |
| **User.findById(id)** | **SELECT ... FROM users WHERE id = $1** |
| **mongoose.connect()** | **pg.Pool** in **db/pool.js** |

Controller queries use **$1**, **$2**, etc. These are parameter placeholders: **pg** sends the values separately, which avoids building SQL by joining user input into a query string.

## Authentication request flow

- **POST /api/auth/register**: validate fields, hash the password with bcrypt, insert the user, then set a session cookie.
- **POST /api/auth/login**: find the row by email, compare the submitted password to its hash, then set the same cookie.
- **GET /api/auth/me**: verify the cookie and return the matching user row.
- **POST /api/auth/logout**: clear the cookie.

The database stores only **password_hash**, never the original password. The API never returns the hash. The **users** table is bootstrapped from SQL on startup for this learning version; as the app grows, we should use versioned database migrations instead.
## Workspace flow

After signing in, the app opens the workspace screen with **Create a workspace** and **Join a workspace**.

- Creating a workspace inserts a row in **workspaces** and an **owner** row in **workspace_members**. The backend returns a 12-character invite code to share.
- Joining uses that invite code and adds a **member** row in **workspace_members**.
- **GET /api/workspaces** lists the signed-in user's workspaces. **POST /api/workspaces** creates one. **POST /api/workspaces/join** joins one.
- **workspace_members** is the relationship table: each row connects one user and one workspace and stores their role. This is the source of truth for membership.
- The authenticated user response includes a **workspaceIds** array computed from **workspace_members**. The array is assembled when reading the user; it is not stored a second time on the **users** row.

In pgAdmin, the tables are under **Schemas → public → Tables**: **users**, **workspaces**, and **workspace_members**.

