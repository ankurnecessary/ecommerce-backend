# Node with typescript

This project gives a boiler plate code for a node project with typescript. It has following features enabled:

1. Development using Hot reloading via Docker.
2. Using Prisma ORM to handle database.
3. Development using Docker container for postgresql DB.
4. GraphQL API implementation.
5. API Documentation via Swagger.

## Documentation

1. [API Documentation](https://ankurnecessary.github.io/ecommerce-backend/)

## PNPM Scripts

1. `pnpm dev` - This is a way to run the code while developing the project without using docker. Even Dockerfile uses this command to run the project inside the container.
2. `pnpm dev:transpile` - It runs the code in dev mode without checking the types declared using typescript.
3. `pnpm dev:docker`  - This command runs docker compoose file to spin up a development container. This will provide a URL for the APIs that we can use further while coding.
4. `pnpm build` - This will just build a project and put the files in dist folder.
5. `pnpm start` - This will start the project using the build files. So before running this command we should have a build in place via command `pnpm build`.
6. `pnpm build:start` - This will make a build and then run the build.
7. `pnpm test` - This will fire up the test files and run the test cases, if present.
8. `prepare` - This will fire automatically when we will run the command `pnpm i`. It will fire after installing all the dependencies.
9. `pnpm lint` - This command will find any kind of linting issues. If we have.
10. `pnpm prod:create` - This command will create a new docker image, uploads new image to AWS ECR, create a new AWS Lambda function and update it with newly created docker image at AWS ECR.
11. `pnpm prod:update` - This command will update an existing docker image, uploads that image to AWS ECR and update existing AWS Lambda function with new image at AWS ECR.
12. `pnpm openapi` - This command will generate openapi.yaml.
13. `pnpm validate-openapi` - This command will validate the generated openapi.yaml.
14. `pnpm watch-openapi` - This command will watch for changes in files to determine new content of opneapi.yaml.
15. `pnpm static-api-doc` - This command will generate static API documentation using redocly at './docs' but this is used in CI / github workflow only.

## Development

Start development server and other utilities using command `pnpm dev:docker`. After that you can use following links to access respective utilities.

1. You can access APIs @ <http://localhost:5000/api>.
2. You can access swagger API documentation @ <http://localhost:8080/>
3. You can access pgAdmin4 @ <http://localhost:8000/>.
