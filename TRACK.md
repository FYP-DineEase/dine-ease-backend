# PORTS
3000 -> client
8080 -> admin

3001 -> auth
3002 -> users
3003 -> login
3004 -> mail 
3005 -> dining-plans
3006 -> map
3007 -> restaurants
3008 -> reviews
3009 -> notifications
3010 -> subscriptions

# TODO
- reset all mongo data
- analysis of review using pynb
- bulk write in restaurant and review service

# Start Script
cmd /c start.bat

# Migrate to Kubernetes
- remove env files
- all ports to 3000
- notification-redis-depl port change to 6379
- In frontend , const socket = io('/', { path: '/socket.io/notifications' });
- In frontend , remove localhost prefix

# Notification Events
- dining plans created 
- dining plans updated
- dining plans deleted 
- restaurant listing approved
- restaurant listing rejected
- restaurant deleted
- vote created
- vote deleted
- modification request approved
- modification request rejeceted

# Upgrade Nestjs
https://dev.to/amirfakour/how-to-upgrade-nestjs-9-to-10-a-developers-guide-32kk
ncu -u -f /^@nestjs/

# Database Clean-up
db.adminCommand('listDatabases').databases.forEach(function(database) {
    db.getSiblingDB(database.name).dropDatabase();
});

# PIP
pip install torch tensorflow nltk numpy
C:\Users\mujta\AppData\Roaming\nltk_data

# K8S
kubectl apply -f restaurant-redis-depl.yaml
kubectl exec -it restaurant-redis-depl-6b7879586b-tbncg -- redis-cli
kubectl port-forward restaurant-redis-depl-6b7879586b-tbncg 6379:6379
keys *

kubectl apply -f nats-depl.yaml
kubectl port-forward nats-depl-59c94999c6-kgvk6 4222:4222
kubectl port-forward nats-depl-59c94999c6-kgvk6 8222:8222

git tag | foreach-object -process { git tag -d $_ | git push --delete origin $_ }

# Meilisearch
kubectl apply -f meilisearch-depl.yaml
kubectl logs -f meilisearch-depl-846fd9694c-9p9d8
kubectl port-forward meilisearch-depl-846fd9694c-9p9d8 7700:7700

## Update 
- notification events and save socket user in redis
- mail event and invitation test
- payment creation remaining in subscription service and expiry
- AI integration and NLP of review
- dining plans complete

- s3 issue with docker , not consistent ( check updated review with images )
- rate limit on check restaurant duplication and other checking endpoints

- update jwt values to 7d later 
- fix validations ( DTOs ) { min max etc } and their redundancy and error messages
- uncomment twilio sendOTP
- fix validations and match with frontend