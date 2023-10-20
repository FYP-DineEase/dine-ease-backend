# PORTS

3000 -> client
3001 -> auth
3002 -> users
3003 -> mail
3004 -> storage
3005 -> login-gateway
3006 -> restaurant

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

kubectl apply -f nats-depl.yaml
kubectl port-forward nats-depl-5fd545d7c4-r8g4h 4222:4222
kubectl port-forward nats-depl-5fd545d7c4-r8g4h 8222:8222

# Common Package
- remove the config module from common package cause it will use k8s env

npm i @nestjs/common@9.4.3
npm i @nestjs/mongoose@10.0.1 --force
npm i @nestjs/config @nestjs/jwt class-transformer mongoose nest-winston winston
npm install --save-dev @types/node rimraf

npm install --save-dev @types/multer

git tag | foreach-object -process { git tag -d $_ | git push --delete origin $_ }

## Update 

- remove dynamic db cause after cluster is live it all will be stored in cluster localhost itself
- Change hard coded jwt values to k8s env
- update config module for k8s valiation
- look into the dockerfile config and omit dev
- fix validations ( DTOs ) { min max etc } and their redundancy 


- isVerified is required cause if phone is changed it will be unverified meanwhile if taxid changes it will be in pending
  and when phone verified again , it will look in records and find previous approved and will make the record approved ( EDGE CASE )


USER:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MTkyY2VmZWIyODAxYjEwODQ4ZWMxOCIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNjk3NTcxNjU2LCJleHAiOjI2OTgxNzY0NTZ9.Yv4zSw8S97D6anOwgI5GRzhqwTbLeypOmjrFmtJMw40

MANAGER:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmZlNDgyMmNjYzgwYTE4ZTFkNTBiMyIsInJvbGUiOiJNYW5hZ2VyIiwiaWF0IjoxNjk3NTcxNjU2LCJleHAiOjI2OTgxNzY0NTZ9.cqV4gCmVFZ9zYddqiXYYDuIQzcJZ2qFdFSPusChkZmE

ADMIN:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmZlNDU2MmNjYzgwYTE4ZTFkNTBhZSIsInJvbGUiOiJBZG1pbiIsImlhdCI6MTY5NzU3MTY1NiwiZXhwIjoyNjk4MTc2NDU2fQ.ZGmAVxSq79aB2QIU6BdQ7AuIoZ7qfsBfIBOg1fyqL6Q