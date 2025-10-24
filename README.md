# Node with typescript

This project gives a boiler plate code for a node project with typescript. It has following features enabled:

1. Development using Hot reloading via Docker.

## Documentation

1. [API Documentation](https://ankurnecessary.github.io/ecommerce-backend/)

## PNPM Scripts

1. `pnpm dev` - This is a way to run the code while developing the project without using docker. Even Dockerfile uses this command to run the project inside the container.
2. `pnpm dev:transpile` - It runs the code in dev mode without checking the types declared using typescript.
3. `pnpm dev:docker`  - This command runs docker compoose file to spin up a development container. This will provide a URL for the APIs that we can use further while coding.
4. `pnpm dev:docker:watch` - We can run this command only after running `pnpm dev:docker` in 2nd separate terminal window. This will keep a watch on the changes in entire project and rebuilds and reruns it if we make any changes in the files.
5. `pnpm build` - This will just build a project and put the files in dist folder.
6. `pnpm start` - This will start the project using the build files. So before running this command we should have a build in place via command `pnpm build`.
7. `pnpm build:start` - This will make a build and then run the build.
8. `pnpm test` - This will fire up the test files and run the test cases, if present.
9. `prepare` - This will fire automatically when we will run the command `pnpm i`. It will fire after installing all the dependencies.
10. `pnpm lint` - This command will find any kind of linting issues. If we have.
11. `pnpm prod:create` - This command will create a new docker image, uploads new image to AWS ECR, create a new AWS Lambda function and update it with newly created docker image at AWS ECR.
12. `pnpm prod:update` - This command will update an existing docker image, uploads that image to AWS ECR and update existing AWS Lambda function with new image at AWS ECR.
13. `pnpm openapi` - This command will generate openapi.yaml.
14. `pnpm validate-openapi` - This command will validate the generated openapi.yaml.
15. `pnpm watch-openapi` - This command will watch for changes in files to determine new content of opneapi.yaml.
16. `pnpm swagger` - This command will generate swagger app and run it via docker container. You can check the url [http://localhost:8080/](http://localhost:8080/) after running this command.
17. `pnpm static-api-doc` - This command will generate static API documentation using redocly at './docs' but this is used in CI / github workflow only.
