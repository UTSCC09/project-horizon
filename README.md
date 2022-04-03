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
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Overview](#overview)
  - [Deployment](#deployment)
  - [Maintenance](#maintenance)
  - [Challenges](#challenges)
  - [Contributions](#contributions)
- [One more thing?](#one-more-thing)
    - [Important](#important)

## Project Description

<!-- **Task:** Provide a detailed description of your app -->

Our application is intended to be a social networking platform tailored for 3D designers and 3D modelling enthusiasts. The way we achieve this is by allowing users to create profiles, upload 3D models, and share them with other users.

Firstly, we have the basic social network functionality including a user feed - to see posts of people you follow, a discover page - to see the newests post on the application and a profile page, to see your profile or any other user's profile. You can find other users by using our apps search bar, finding a comment they made on a post you're following, or seeing them in the discover page.

Then, as for the new functionality, all posts on our application have an image we call a snapshot. This snapshot is created during the posting process by uploading (1 or multiple) 3D models to our site, editing them with our tools and positioning the camera for a snapshot. Then after adding a description you can add the post to your profile. When looking at a post you'll be able the snapshot with a series of actions below it, including render. If you press render you'll be able to see the posters 3D models in the original formation they set them in and explore the scene they created. This allows for you to explore their post in an amount of detail not possible with traditional images.

After the 3D functionality, we have also included a basic notification system allowing you to be notified if someone follows you or likes one of your comments/posts.

## Development
<!-- **Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used. -->
Both our frontend and backend are nodejs applicaitons with the use of npm.

### Frontend
Our frontend is built in Angular using TS and we rely heavily on TS support, injectable services, custom components and pipes and subscriptions. TS allows us to use static types and compile time errors without stepping away from JS, and Angular enables us to take advantage of it while provided a large array of supported libraries. We split our app into segments of major components, which are generally specific to a page in our site, minor components which are used for rendering handling repeated functionality and services, which hold the main functionality of our app and can be injected into any page that needs the functionality.

We haven't encorporated any third party API's for development, but we use a wide variety of libraries to support certain tasks. Firstly, we use PrimeNG (from primefaces), Bootstrap and Fontawesome to provide a responsive design and a consistent look across our site. Then we have ThreeJS, which we use together with our 3DEngine and 3DScene services to handle building our post scenes and rendering them. ThreeJS is imported into our services while the services are injected into our components in order to render the scenes and fill their functionality. Lastly, we have a few api services that extend the base api service which uses Apollo for handling GraphQL functionality. User driven events are listened to in a component, which then calls the appropriate api service and subscribes to it in order to provide the user with feedback to its response.

### Backend
<!-- ... -->

<!-- Finish the first part of this paragraph explaining JWTs -->
**JWTs explanations**. Then in order to overcome the lack of destroyable tokens with JWTs, we created a blacklisting service to hold onto unexpired tokens of signed out users. This service has a cache that is also checked before validating a JWT and if that cache doesn't show that our token is blacklisted, we also have the service check redis. This check is done through our redis service, which handles multiple connections to our redis db. So whenever a user signs out the token is blacklisted in cache and pushed to redis with a TTL of the tokens remaining lifespan.

We also implemented Redis to handle PubSub across pods in order for us to implement a simple notification system with long polling. Our redis service creates and handles our subscriber and publisher connections so that our GraphQL services can create and subscribe to events when necessary.

### Overview
Below is a quick overview and recap of our main libraries
```yml
- Frontend:
  - Angular
  - Libraries:
    - Three.js: WebGL library for rendering 3d graphics
    - PrimeNg & Bootstrap: UI library
    - FontAwesome: Icon library
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
```

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
<!-- Explain why you went with Kubernetes -->

2. 3D Engine

The 3D engine is one of the main features of our app and a lot of functionality needed to be built out for it to work as we intended. Even after using ThreeJS (a library listed on the class site resources tab), we still needed to make services to work with the library in the way we wanted. After we setup the basic canvas, we then needed to figure out how to get STLs to upload and take snapshots of them. We implemented a 3d controls service to handle editable objects and an engine to control the canvas and allow us to take snapshots of individual objects (for the table of objects) and the final scene.

One thing we learned was that keeping these scenes rendered took significantly more performance than expected, so after some troubleshooting we also developed an `EngineManagerService` to un-render posts and keep the number of rendered canvas below a threashold. This increased the performance of our app and fixed some issues we were having with crashing canvases.

Another challenge was handling the saved scene and storing it along with the post details in the backend. **TALK ABOUT STORING SCENE JSON**

3. Long Polling

Setting up long polling and our notification system was the third most challenging/educational part of our site development. We had to implement a system that allowed users to get events that relates to them in real time. We quickly decided to use long polling from the frontend since we didn't need to send messages back (eliminating websockets), and apollo natively supports the functionality with a sinple interval and flag change. The difficulties with long polling arise with our server events.

In order to create a notification system the notification endpoint would need to subscribe to events emitted from other endpoints (like commenting on a post), but this raises an issue with our multi-pod deployment. If we have multiple backend instances running in order to handle our sites traffic flow and CPU usage, event emitted in one pod won't be subscribed to in another. In order to fix this we implemented Redis Pub/Sub instead of standard NodeJS events. This way we can lean on the redis server to track the published subscribers across our cluster and maintain their accuracy across pods. This implementation made our development, design and deployment more challenging but taught us a lot and was required because of lean away from WS.

## Contributions
<!-- **Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).  -->

Basic, elaborate.

- Ahmed Halat
  Was in charge of the 3D services, components and rendering as well as creating the basic setup for the frontend. The basic frontend setup includes routing, navigation, structuring, pages and the frontend static pages like login and register. He also created the frontend and backend functionality for Notifications (setting up long polling and redis), Searching for user profiles and paginating posts and comments and the message service.
  His main responsibility was however, working on the new post dialog including: allowing user to uploads STLs and render them, creating snapshots of scenes, customize and manipulate the STLs within a scene.
- Mohamed Halat
  - Figuring out basic backend architecture (typeorm + gql)
  - Auth
  - Deployment
  - Comments
  - Liking
  - Following

# One more thing?

### Important
- Since there are a lot of different encoding types for STLs, it's important to note that _**uploading wont work with all STLs**_ (we show the relevant error when it fails). We curated a list of sample stls in the repo for you to download and try uploading to our website. These sample STLs were downloaded from thingiverse with creative commons or MIT liscences.
