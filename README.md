# Project Horizon

## Project URL: [horizon.mohamedhalat.com](https://horizon.mohamedhalat.com)

## Project Video URL

**Task:** Provide the link to your youtube video. Please make sure the link works.

## Table of Contents
- [Project Horizon](#project-horizon)
  - [Project URL: horizon.mohamedhalat.com](#project-url-horizonmohamedhalatcom)
  - [Project Video URL](#project-video-url)
  - [Table of Contents](#table-of-contents)
  - [Project Description](#project-description)
  - [Development](#development)
    - [Stack](#stack)
  - [Deployment](#deployment)
  - [Maintenance](#maintenance)
  - [Challenges](#challenges)
  - [Contributions](#contributions)
- [One more thing?](#one-more-thing)

## Project Description

**Task:** Provide a detailed description of your app

A social network for game developers and 3d artists. Works similar to most social networks and allows posting, commenting, liking, user feeds, private messaging, and more.
The key feature is the ability to create and share 3d models.

Additionally, we want to be heavily feed and friend focused. So when you first register for the app you can subscribe to friends feeds and see an aggreated feed of all your friends activities (or view independent feeds).
Then, we want a messaging system that also allows you to create DM to your friends.

## Development

<!-- **Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. -->

### Stack
Our techstack relies on NodeJS on both the front and backend. We decided to use Angular for the frontend library because of it's simplicity
and NestJS, Postgresql and Apollo for the backend because of their GraphQL support.
- Frontend:
  - Angular
  - Libraries:
    - Three.js: WebGL library for rendering 3d graphics
    - PrimeNg & Bootstrap: UI library
    - Apollo: GraphQL api library
- Backend:
  - Nest.js
    - Apollo: GraphQL driver
    - Sentry: Error Monitoring
    - TypeORM: ORM for Postgresql
    - Terminus: API health check
  - DB: Postgresql
  - Cache: Redis (also used as a cross pod pub/sub)
  - Auth: Passport.js/JWT

## Deployment
Our entire application is deployed on Google Cloud Platform's (GCP) Google Kubernetes Engine (GKE).
This proved to be more challenging then we initially though as we had to deploy a variety of services, but also had to fix a suprising amount of issues. The deployments consist of the following (linked are the relevant kubernetes YML files):
- [Frontend and backend deployments and service](/kube/deployment.yml)
- [Ingress Controller and SSL](/kube/ingress.yml)
- [Postgresql DB](/kube/psql.yml)
- [Redis deployement and service](/kube/redis.yml)
- [Persistant volume for storing files](/kube/volume.yml)

As for how the actual deployment works, we use a seperate deployment and node port services for both the frontend and backend. Both of these container images are built using docker and pushed onto the GCP container registry.

We then use an ingress controller to route traffic to the correct node port. This ingress controller was also given a static IP, hostname and an SSL certificate to allow secure connection to the entire application.

We also use persistent volumes to store the files uploaded by the users. This is done to ensure that the files are not lost when the application is restarted.

Finally, we have seperate services/deployments for both postgresql and redis which are not given an external ip and thus not accessible outside the cluster. A health check is also added to the backend's postgressql service to ensure that the database is accessible before a new pod is set as the active one, which took us a long time to figure out and debug.


**Note:** For some more information on the first/second attempt at deploying the application as well as our sources for the deployment, please refer to the [gcloud.md](/kube/gcloud.md) file.

## Maintenance
<!-- **Task:** Explain how you monitor your deployed app to make sure that everything is working as expected. -->
We use a varity of tools to monitor and maintain our application.

First of all, we use a variety of github actions to ensure our application is always error free on the build stage. These actions include an action that runs the build commands on PRs to ensure that the PR doesn't break the build. Then we also use a github action to deploy the application on commits to main. Sadly these actions don't currently work because of the issue recorded on [piazza](https://piazza.com/class/kxgjicgvryu3h8?cid=423#).

As for monitoring our application, we again use different tools at different parts of the application. We use Sentry to monitor our backends and record/report on errors occuring in real time. We then use GCP's error reporting tools to get any notifications on errors occuring within Kubernetes itself such as Pod failures. GCP's maintenance tools also allow us to view all logs for our application but it is not as easy to manage as Sentry. Finally, we also use the GKE dashboard to monitor our application's health, traffic and resource usage. Auto scaling is also used to automatically scale the number of pods in the application based on resource requirements (currently increases number of pods when CPU usage increases above 50%).

## Challenges

<!-- **Task:** What is the top 3 most challenging things that you have learned/developed for you app? Please restrict your answer to only three items. -->

1. Deployment
2. 3D Engine
3. Long Polling

## Contributions
<!-- **Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).  -->

Basic, elaborate.

- Ahmed
  - 3D engine
  - Adding Posts
  - Redis integration/deployment
  - Github Build Actions
  - Notification System
- Mohamed
  - Figuring out basic backend architecture (typeorm + gql)
  - Auth
  - Deployment
  - Comments
  - Liking
  - Following

# One more thing?

**Task:** Any additional comment you want to share with the course staff?
