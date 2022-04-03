# GCloud Deployment

## Table of Content
- [GCloud Deployment](#gcloud-deployment)
  - [Table of Content](#table-of-content)
  - [Setup](#setup)
  - [Useful Commands](#useful-commands)
  - [Attempt 1 - Failed](#attempt-1---failed)
  - [Attempt 2 - Success](#attempt-2---success)
    - [SSL Certificates](#ssl-certificates)
  - [CI/CD](#cicd)
  - [Scalling](#scalling)
- [Sources](#sources)

## Setup
```sh
gcloud projects list

gcloud config set project $GCP_PROJECT_ID
gcloud config set compute/zone northamerica-northeast2-a #Toronto
gcloud config set artifacts/location northamerica-northeast2
gcloud config set compute/region northamerica-northeast2

gcloud components install kubectl

gcloud auth configure-docker northamerica-northeast2-docker.pkg.dev
```

## Useful Commands
```sh
docker build . -t gcr.io/horizon-c09/frontend:latest
docker push . -t gcr.io/horizon-c09/frontend:latest
kubectl rollout restart deployment frontend


kubectl get pods
kubectl get svc
kubectl get deployments
kubectl get all
```

## Attempt 1 - Failed
Used a load balancer service on the frontend and had frontend's nginx proxy to the backend's cluster ip.
Sadly couldn't manage to get this type of implementaiton to work with neither a ssl cert or a google managed ssl cert. Also used artifacts repository to store the docker images for the backend and frontend instead of google's container registry.

**Note:** These commands are not 100% the commands we used, some are missing and some say slightly different things to what we actually commited. Explanation above explains what we did.
```sh
# Artifacts
gcloud artifacts repositories create horizon-back-repo --repository-format=docker
gcloud artifacts repositories create horizon-front-repo --repository-format=docker
gcloud artifacts print-settings npm --repository="my-repository"

# Building and pushing images
docker build . -t northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1
docker push northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1

docker build . -t northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-front-repo/frontend:v1
docker push northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-front-repo/frontend:v1

# Create deployments
kubectl create deployment backend --image=northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1

kubectl expose deployment backend --name=backend-deploy --type=LoadBalancer --port=80

kubectl set image deployment/hello-app hello-app=REGION-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v2

gcloud compute addresses create backend-address --region=northamerica-northeast2
```
## Attempt 2 - Success
Attempt 2 was successful. We used seperate node ports for frontend and backend. This allowed me to use an Ingress controller to route traffic between frontend and backend. We also learned how to add a health check to the backend so deployments would go more smoothly. You can see the config for everything under the kube folder.
This deployment includes:
- [Frontend and backend](/kube/deployment.yml)
- [Ingress Controller](/kube/ingress.yml)
- [Postgresql DB](/kube/psql.yml)
- [Redis](/kube/redis.yml)
- [Persistant disk for storing files](/kube/volume.yml)


### SSL Certificates
We ended up using a google managed ssl certificate for the horizon domain.

```sh
gcloud compute ssl-certificates create horizon \
    --domains=horizon.mohamedhalat.com \
    --global
```

## CI/CD
Adding Github CI/CD. Sadly it does not work at this moment because of the issue shown in the [piazza post](https://piazza.com/class/kxgjicgvryu3h8?cid=423).
```sh
gcloud iam service-accounts create $SA_NAME
gcloud projects add-iam-policy-binding $GKE_PROJECT \
	--member=serviceAccount:$SA_EMAIL \
	--role=roles/container.admin
gcloud projects add-iam-policy-binding $GKE_PROJECT \
	--member=serviceAccount:$SA_EMAIL \
	--role=roles/storage.admin
```

## Scalling
Most of the scalling was configured on the website.

```sh
kubectl scale deployment hello-app --replicas=3
kubectl autoscale deployment hello-app --cpu-percent=80 --min=1 --max=5

kubectl autoscale deployment backend --max 3 --min 1 --cpu-percent 50
```

# Sources
- https://www.mirantis.com/blog/introduction-to-yaml-creating-a-kubernetes-deployment/
- https://cloud.google.com/kubernetes-engine/docs/concepts/ingress
- https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs#gcloud_2
- https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- https://newrelic.com/blog/how-to-relic/kubernetes-health-checks
- https://medium.com/@athulravindran/google-kubernetes-engine-gke-persistence-volume-nfs-on-multiple-nodes-readwritemany-4b6e8d565b08