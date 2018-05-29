# Readme

## Building the docker image for end to end development

Navigate up one directory and run `docker compose up`
This will deliver and end to end experience where all tests from the client can
be run. No end to end tests are included in the server unit tests

## Building the docker image for local development

Run this repo's Dockerfile to unit test the server.
The unit tests use an in-memory MongoDB to test the API against.

## API

### Base Route: `/api/todos/`

- GET -> list
  - Returns a list of todos stored in the database.
- POST -> create
  - Creates a new todo

### Base Route: `/api/todos/:id`

- PUT -> update
  - Updates and existing todo
- DELETE -> delete
  - Deletes a todo
