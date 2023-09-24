# Initializing New Service

nest new .
npm i @nestjs/common@9.4.3
npm i @nestjs/core@9.4.3 
npm i @nestjs/platform-express@9.4.3

npm i @nestjs/mongoose@10.0.0

npm i cross-env @hapi/joi @types/hapi__joi @nestjs/mongoose mongoose class-validator @nestjs/config
npm i nest-winston winston 
npm i bcryptjs
npm i @nestjs/mongoose mongoose
npm i mongoose-update-if-current
npm i @nestjs/microservices@9.4.3
npm i @nestjs-plugins/nestjs-nats-streaming-transport

npm i @dine_ease/common
npm update @dine_ease/common
npm i --save-dev @types/node

# Common Package
- remove the config module from common package cause it will use k8s env

npm i @nestjs/common@9.4.3 --save-peer 
npm i @nestjs/mongoose@10.0.1 --save-peer --force
npm i @nestjs/config @nestjs/jwt class-transformer mongoose nest-winston winston --save-peer
npm install --save-dev @types/node rimraf

git tag | foreach-object -process { git tag -d $_ | git push --delete origin $_ }