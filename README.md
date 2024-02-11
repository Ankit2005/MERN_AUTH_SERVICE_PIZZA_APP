# MERN_COURSE_PIZZA_APP

# Step-by-step Guide 🚀 🚀

mern micro-services pizza web app

# If certs folder is empty then run

This command is create new private.pem & public.pem key

```bash
node scripts/generateKeys.mjs
```

# Running the Express App in a Docker Container 🚀

This command will produce a Docker image named auth-service with the tag dev.
Navigate to the directory containing your Dockerfile and run:

```bash
docker build -t auth-service:dev -f docker/dev/Dockerfile .
```

Once the image is built, you can run it:

```bash
docker run --rm -it -v $(pwd):/usr/src/app -v /usr/src/app/node_modules --env-file $(pwd)/.env -p 5501:5501 -e NODE_ENV=dev auth-service:dev
```

ℹ️ For Powershell users:
use ${PWD} instead of $(pwd)
ℹ️ For Command prompt (cmd) users:
use %cd% instead of $(pwd)

Your Express app is now accessible at http://localhost:5501.

# Stopping the Docker Container ✋🏻

You can stop the running container by using this command:

// If container is running in interactive mode.
ctr + c

// If container is running in detached mode.
// List all running container
docker ps

// Stop the container using container id
docker stop <container id>

# Running the PostgreSQL in a Docker Container 🚀

## Pull the PostgreSQL Docker image 🖼️

```bash
docker pull postgres
```

## Create a Persistent Volume 💾

Persistent volumes ensure that the data remains intact even if the container stops or crashes.

```bash
docker volume create mernpgdata
```

## Run the PostgreSQL container with the volume attached 🏃‍♂️

```bash
docker run --rm --name mernpg-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -v mernpgdata:/var/lib/postgresql/data -p 5432:5432 -d postgres
```

This setup should get you started with PostgreSQL using Docker. Make sure to adjust configurations as needed for your specific environment.
