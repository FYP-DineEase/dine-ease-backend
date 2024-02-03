# PORTS

3000 -> client

3006 -> restaurant      -> abc5
3007 -> reviews         -> abc6
30xx -> notifications   -> abc7

install class-transformer , delete hapi/joi
build map and users image and publish it
check envs are available through @nestjs/config or not

# Upgrade Nestjs
https://dev.to/amirfakour/how-to-upgrade-nestjs-9-to-10-a-developers-guide-32kk

# Docker
docker build -t mujtabashafiq/dine-ease-auth .
docker push mujtabashafiq/dine-ease-auth

# K8S
kubectl apply -f restaurant-redis-depl.yaml
kubectl exec -it restaurant-redis-depl-6b7879586b-tbncg -- redis-cli
kubectl port-forward restaurant-redis-depl-6b7879586b-tbncg 6379:6379
keys *

kubectl apply -f nats-depl.yaml
kubectl port-forward nats-depl-5fd545d7c4-r8g4h 4222:4222
kubectl port-forward nats-depl-5fd545d7c4-r8g4h 8222:8222

git tag | foreach-object -process { git tag -d $_ | git push --delete origin $_ }

## Update 
- payment creation remaining in subscription service
- notification events
- mail event and invitation test
- review service : images upload/delete
- AI integration and NLP of review
- enable trust proxy for all services

- rate limit on check restaurant duplication and other checking endpoints
- add redis where necessary

- update jwt values to 7d later 
- fix validations ( DTOs ) { min max etc } and their redundancy and error messages

- remove the mongo-secret since data will be stored locally , 
    currently on VM close data gets lost, so storing it in a cloud