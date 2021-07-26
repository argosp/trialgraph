# Trials graphQL service

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

create a .env file with the next contents
```
PORT=8888
ROOT_URI=http://localhost:3000
ROOT_TOKEN=eyJhbGciOiJIUzI1NiJ9.JTdCJTIyX2lkJTIyOiUyMjYwZmU4MTM3OWNjMTU4NmUxOThkODdiYiUyMiwlMjJ1aWQlMjI6JTIyNmJiMDZlYTAtZWRmNC0xMWViLWJhOWMtNzVhNzk5YmZkYTMzJTIyLCUyMmlkJTIyOiUyMnRlc3RAbGlubm92YXRlLm5ldCUyMiwlMjJ1c2VybmFtZSUyMjolMjJsaW9yJTIyLCUyMm5hbWUlMjI6JTIybGlvciUyMiwlMjJlbWFpbCUyMjolMjJ0ZXN0QGxpbm5vdmF0ZS5uZXQlMjIsJTIyX192JTIyOjAsJTIyR2V0TWFpbEV2ZXJ5RGF5QWJvdXRHaXZlblRhc2tzJTIyOiUyMm5vJTIyLCUyMkdldE1haWxFdmVyeURheUFib3V0TXlUYXNrcyUyMjolMjJubyUyMiwlMjJHZXRNYWlsRXZlcnlXZWVrQWJvdXRHaXZlblRhc2tzJTIyOiUyMm5vJTIyLCUyMkdldE1haWxFdmVyeVdlZWtBYm91dE15VGFza3MlMjI6JTIybm8lMjIsJTIycHJvdmlkZXIlMjI6JTIybG9jYWwlMjIsJTIycm9sZXMlMjI6JTVCJTIyYXV0aGVudGljYXRlZCUyMiU1RCU3RA.kHHiw6_OVCS1esL4imxjt0XHtUlM_3PsHxKGYFWY5oo
```

To get the ROOT_TOKEN you need to simulate a login within the graphql
See the following loom for the example.

<div style="position: relative; padding-bottom: 62.5%; height: 0;"><iframe src="https://www.loom.com/embed/6d3973b262374f84b2a6338fa9c297e6" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>


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



