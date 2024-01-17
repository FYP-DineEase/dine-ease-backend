# PORTS

3000 -> client  
3001 -> auth            -> abc1
3002 -> users           -> acb2
3003 -> mail            -> abc3
3004 -> storage         -> abc4     # DELETED
3004 -> users-aggregate
3006 -> restaurant      -> abc5
3007 -> reviews         -> abc6
3008 -> user-map        -> abc7
3009 -> subscription    -> abc8


# Initializing New Service

nest new .
npm i @nestjs/common@9.4.3
npm i @nestjs/core@9.4.3 
npm i @nestjs/platform-express@9.4.3

npm i @nestjs/mongoose@10.0.1

npm i bcryptjs
npm i cross-env @nestjs/mongoose mongoose class-validator mongoose-update-if-current nest-winston winston
npm i @nestjs/config @hapi/joi
pm i --save-dev @types/hapi__joi
npm i @nestjs/microservices@9.4.3
npm i @nestjs-plugins/nestjs-nats-streaming-transport

npm i @dine_ease/common
npm update @dine_ease/common
npm i --save-dev @types/node

# Docker
docker build -t mujtabashafiq/dine-ease:auth .
docker push mujtabashafiq/dine-ease:auth

# K8S
kubectl apply -f restaurant-redis-depl.yaml
kubectl exec -it restaurant-redis-depl-6b7879586b-tbncg -- redis-cli
kubectl port-forward restaurant-redis-depl-6b7879586b-tbncg 6379:6379

keys *

kubectl apply -f nats-depl.yaml
kubectl port-forward nats-depl-5fd545d7c4-r8g4h 4222:4222
kubectl port-forward nats-depl-5fd545d7c4-r8g4h 8222:8222

# Common Package
npm i @nestjs/common@9.4.3
npm i @nestjs/mongoose@10.0.1 --force
npm i @nestjs/config @nestjs/jwt class-transformer mongoose nest-winston winston
npm install --save-dev @types/node rimraf

npm install --save-dev @types/multer

git tag | foreach-object -process { git tag -d $_ | git push --delete origin $_ }

## Update 

- restaurant avatar upload and replace
- menu item filter then reset index then save on indexes update
- payment creation remaining in subscription service
- review service : images upload/delete
- review service : restaurant ratings ( multiple remaining ) return in key value pair
- map service : nanoid issue in  ( reference the review service ) [ on spam nanoid repeats ]

- notifications
- dining plans
- badge service

- rate limit on check restaurant duplication and other checking endpoints

- add redis for restaurant
- aggregate user data in user map get by slug

- Change hard coded jwt values to k8s env
- update jwt values to 7d later 
- update config module with schema for k8s valiation

- look into the dockerfile config and omit dev

- fix validations ( DTOs ) { min max etc } and their redundancy
- fix error messages

- remove dynamic db cause after cluster is live it all will be stored in cluster localhost itself