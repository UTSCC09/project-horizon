# GCloud deploy

gcloud projects list

gcloud config set project $GCP_PROJECT_ID
gcloud config set compute/zone northamerica-northeast2-a
gcloud config set artifacts/location northamerica-northeast2
gcloud config set compute/region northamerica-northeast2

gcloud components install kubectl

gcloud auth configure-docker northamerica-northeast2-docker.pkg.dev

gcloud artifacts repositories create horizon-back-repo --repository-format=docker

gcloud artifacts print-settings npm --repository="my-repository"

docker build . -t northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1

gcloud auth configure-docker northamerica-northeast2-docker.pkg.dev
docker push northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1

gcloud container clusters list
gcloud container clusters get-credentials horizon-cluster

kubectl create deployment backend --image=northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1

kubectl scale deployment hello-app --replicas=3
kubectl autoscale deployment hello-app --cpu-percent=80 --min=1 --max=5

docker build . -t northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1
docker push northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-back-repo/backend:v1
kubectl rollout restart deployment

kubectl expose deployment backend --name=backend-deploy --type=LoadBalancer --port=80

kubectl set image deployment/hello-app hello-app=REGION-docker.pkg.dev/${PROJECT_ID}/hello-repo/hello-app:v2

gcloud compute addresses create backend-address --region=northamerica-northeast2
<!-- https://www.googleapis.com/compute/v1/projects/horizon-c09/regions/northamerica-northeast2/addresses/backend-address -->


gcloud artifacts repositories create horizon-front-repo --repository-format=docker
docker build . -t northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-front-repo/frontend:v1
docker push northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-front-repo/frontend:v1

kubectl create deployment frontend --image=northamerica-northeast2-docker.pkg.dev/horizon-c09/horizon-front-repo/frontend:v1


docker build . -t gcr.io/horizon-c09/frontend:latest


gcloud compute ssl-certificates create horizon \
    --domains=horizon.mohamedhalat.com \
    --global

    <!-- https://cloud.google.com/load-balancing/docs/ssl-certificates/google-managed-certs#gcloud_2 -->
    <!-- https://cloud.google.com/kubernetes-engine/docs/concepts/ingress -->
    <!-- https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/ -->
    <!-- https://newrelic.com/blog/how-to-relic/kubernetes-health-checks -->
    <!-- https://medium.com/@athulravindran/google-kubernetes-engine-gke-persistence-volume-nfs-on-multiple-nodes-readwritemany-4b6e8d565b08 -->


gcloud iam service-accounts create $SA_NAME
gcloud projects add-iam-policy-binding $GKE_PROJECT \
	--member=serviceAccount:$SA_EMAIL \
	--role=roles/container.admin
gcloud projects add-iam-policy-binding $GKE_PROJECT \
	--member=serviceAccount:$SA_EMAIL \
	--role=roles/storage.admin