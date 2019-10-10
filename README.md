# ELEMENTOR GRAPHQL

Midlleware graphql server based on dockers

WE DO NOT USE BABEL AND ES6 MODULES. USE REQUIRE AND MODULE.EXPORTS...
### Prerequisites

Make sure to have docker installed on your machine

```
docker -v
```
to see the docker version (if exists on your machine)

## Getting Started

In the terminal, go to your root directory (e.g. "Desktop") and run the following commands 

### Installing

#### Clone the project and enter to the project folder 

```
git clone git@gitlab.linnovate.net:elementor/experts/graph.git
cd graph
```
#### .env

The directory your just cloned contains .env.example file.
.env.example has the minimum values you need in order to get started.
remove the ".example" extension and you are ready to go.

#### Run build.sh 

In the terminal, make sure you are in the root folder of the app 
(should be named 'graph' by default ) and run

```
./build.sh

```
build.sh will run for you docker-compose up --build && docker-compose ps
any changes on the the local code will immediately affect the docker container and nodemon will reload the server for you

NO NEED TO INSTALL NODE_MODULES LOCALLY

## Ready to go

By now, if no errors occurred, you should be done with the installation.

You can check your work by going to http://localhost:8888/graphql in your browser.
You should be able to see the graphql playground running on your docker container.
If you want to change the default Query, you can do it in the example.js file in ./graph/src/app/example.js 

T1

