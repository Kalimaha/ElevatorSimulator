# Elevator Simulator
The elevator Simulator is an Elevator system with a web frontend and backend storage system.
* The gui should cater for 4 elevators (_numbered A,B,C and D_) and 10 floors.
* Each elevator should not take on more than 20 people at a time.
* People on a certain floor (_for example, Level 9_) should get the nearest available elevator (_eg, say 3 elevators {A,B,C} are on floor 1 and the fourth {D} is on level 10 then elevator D should travel to get the people on level 9_)
* The gui should show each level and the number of people who wish to enter an elevator (_textbox_)
* Each level should have dropdown menu and button beside it to represent the level / floor that the people on the said level wish to travel to
* On each level there should be another 4 columns which show each elevator status. That is, the number of people in the current elevator and whether it’s going up (^) down (\/) or stationary (-)

## Back-end
[![Build Status](https://travis-ci.org/Kalimaha/ElevatorSimulatorServices.svg?branch=master)](https://travis-ci.org/Kalimaha/ElevatorSimulatorServices)
[![Coverage Status](https://coveralls.io/repos/github/Kalimaha/ElevatorSimulatorServices/badge.svg?branch=master)](https://coveralls.io/github/Kalimaha/ElevatorSimulatorServices?branch=master)

The back-end of the application is in charge of storing and retrieving data from the remote storage. The architecture is based on the REST paradigm and the data is stored in a NoSQL database.

### Source Code
The back-end has been developed with Python and the [Flask](http://flask.pocoo.org/) micro framework. The source code is available on GitHub at [this link](https://github.com/Kalimaha/ElevatorSimulatorServices).

### Tests
The project is under continous integration on the [Travis CI](https://travis-ci.org/) platform. Tests are available and can be executed at [this link](https://travis-ci.org/Kalimaha/ElevatorSimulatorServices).

### Deploy
The back-end has been deployed on the [Heroku](https://www.heroku.com/apps) platform and it is available at [this link](https://elevatorsdata.herokuapp.com/elevators/production/).

# Storage
The storage system is hosted by [MongoLab](https://mlab.com/). There is one instance for the production data and one instance that is used to perform tests.

## Front-end