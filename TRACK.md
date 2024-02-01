# PORTS

3000 -> client  
3001 -> auth            -> abc1
3002 -> users           -> acb2
3003 -> mail            -> abc3
3004 -> users-aggregate
3006 -> restaurant      -> abc5
3007 -> reviews         -> abc6
3008 -> user-map        -> abc7
3009 -> subscription    -> abc8
3010 -> dining-plans    -> abc9

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

# Common Package
npm i @nestjs/common@9.4.3
npm i @nestjs/mongoose@10.0.1 --force
npm i @nestjs/config @nestjs/jwt class-transformer mongoose nest-winston winston
npm install --save-dev @types/node rimraf

npm install --save-dev @types/multer

git tag | foreach-object -process { git tag -d $_ | git push --delete origin $_ }

## Update 
- payment creation remaining in subscription service
- notification events
- mail event and invitation test
- review service : images upload/delete
- rename users-aggregate to login-gateway
- AI integration and NLP of review
- enable trust proxy for all images

- rate limit on check restaurant duplication and other checking endpoints
- add redis for restaurant

- update jwt values to 7d later 

- fix validations ( DTOs ) { min max etc } and their redundancy and error messages

- remove the mongo-secret since data will be stored locally , 
    currently on VM close data gets lost, so storing it in a cloud