# Solidus Serverless API

A containerized Solidus API that can be deployed to AWS using AWS's Cloud Development Kit (CDK).
Utilizing Fargate and Serverless Aurora (MySQL) for a very-near-serverless environment.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* Docker, Podman or any container based platform that can utilize docker-compose.

### Installation

```
$ docker build . --tag solidus-eks
```

## Usage

To run the application:

```
$ docker-compose up
```

## Deployment

### Dev

Development or individual branches can be deployed as follows:

* `cd` into the `./infra` directory
* Install required Node modules
* `npx cdk deploy solidus-test-eks`
