# Elevator Simulator
The elevator Simulator is an Elevator system with a web frontend and backend storage system.
* The gui should cater for 4 elevators (_numbered A,B,C and D_) and 10 floors.
* Each elevator should not take on more than 20 people at a time.
* People on a certain floor (_for example, Level 9_) should get the nearest available elevator (_eg, say 3 elevators {A,B,C} are on floor 1 and the fourth {D} is on level 10 then elevator D should travel to get the people on level 9_)
* The gui should show each level and the number of people who wish to enter an elevator (_textbox_)
* Each level should have dropdown menu and button beside it to represent the level / floor that the people on the said level wish to travel to
* On each level there should be another 4 columns which show each elevator status. That is, the number of people in the current elevator and whether it’s going up (^) down (\/) or stationary (-)

## UI Preview
![Elevator Simulator](src/images/ElevatorSimulator.png)

## Back-end
[![Build Status](https://travis-ci.org/Kalimaha/ElevatorSimulatorServices.svg?branch=master)](https://travis-ci.org/Kalimaha/ElevatorSimulatorServices)
[![Coverage Status](https://coveralls.io/repos/github/Kalimaha/ElevatorSimulatorServices/badge.svg?branch=master)](https://coveralls.io/github/Kalimaha/ElevatorSimulatorServices?branch=master)

The back-end of the application is in charge of storing and retrieving data from the remote storage. The architecture is based on the REST paradigm, data is retrieved through the GET method from the remote database and it is stored in it through POST calls.

### Source Code
The back-end has been developed with Python and the [Flask](http://flask.pocoo.org/) micro framework. The source code is available on GitHub at [this link](https://github.com/Kalimaha/ElevatorSimulatorServices). The source code is organized with a _core_ package, which contains the DAO implementation, and a _rest_ package, which hold the implementation of the REST interface. The main script of the application is in charge of initializing the Flask framework, the CORS filters and the [REST blueprint](http://flask.pocoo.org/docs/0.10/blueprints/).

### Tests
The project is under continous integration on the [Travis CI](https://travis-ci.org/) platform. Tests are available and can be executed at [this link](https://travis-ci.org/Kalimaha/ElevatorSimulatorServices). The tests coverage can be found on [Coveralls](https://coveralls.io/) at [this link](https://coveralls.io/github/Kalimaha/ElevatorSimulatorServices).

### Deploy
The back-end has been deployed on the [Heroku](https://www.heroku.com/apps) platform and it is available at [this link](https://elevatorsdata.herokuapp.com/elevators/production/).

# Storage
The storage system is hosted by [MongoLab](https://mlab.com/). There is one instance for the production data and one instance that is used to perform tests.

## Front-end
[![Build Status](https://travis-ci.org/Kalimaha/ElevatorSimulator.svg?branch=master)](https://travis-ci.org/Kalimaha/ElevatorSimulator)

The front-end has been developed in JavaScript with the [RequireJS](http://requirejs.org/) and [Bootstrap](http://getbootstrap.com/) frameworks.

The client contains a timer (_that can be started and paused by the user_). At each iteration of the clock the system refresh the status of the elevators. When an elevator is requested, the application determines the closest elevator and changes che global schedule accordingly.

The history of each elevator is stored in the remote database and it can be recalled by the corresponding _History_ button available in the interface. A new session code is generated every time the client is accessed by a user. The DB contains the history of all the elevators by session code. The history function shows the records for a given elevator and session code.

### Source Code
Source code is available on GitHub at [this link](https://github.com/Kalimaha/ElevatorSimulator).

### Tests
The BDD framework [Jasmine](http://jasmine.github.io/) has been integrated with RequireJS to allow this project to be under continous integration on the [Travis CI](https://travis-ci.org/) platform. Tests are available and can be executed at [this link](https://travis-ci.org/Kalimaha/ElevatorSimulator/).

### Deploy
The front-end has been deployed on the GitHub hosting and it is available at [this link](http://kalimaha.github.io/ElevatorSimulator).
