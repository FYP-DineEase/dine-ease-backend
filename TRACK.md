# Notification Events

restaurant listing approved
restaurant listing rejected
restaurant deleted
modification request approved
modification request rejeceted
invited to dining plan
vote created

delete notification on unvote
delete previous notification on vote update
delete nofifications of vote on review delete
delete nofication of dining plan invitation

review rating required in dining-plans/map/restaurants (with content)
review created/update/delete event listeners
review count and rating inclusion in restaurant fetch in the above services

# Upgrade Nestjs
https://dev.to/amirfakour/how-to-upgrade-nestjs-9-to-10-a-developers-guide-32kk
ncu -u -f /^@nestjs/


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
- notification events and save socket user in redis
- mail event and invitation test
- payment creation remaining in subscription service and expiry
- AI integration and NLP of review
- Dataset copy to mongodb (remove duplicate and null values filter from dataset)

- s3 issue with docker , not consistent ( check updated review with images )
- rate limit on check restaurant duplication and other checking endpoints

- update jwt values to 7d later 
- fix validations ( DTOs ) { min max etc } and their redundancy and error messages
- uncomment twilio sendOTP

- update the skaffold.yaml ( uncomment )
- remove the mongo-secret since data will be stored locally , 
    currently on VM close data gets lost, so storing it in a cloud


## Workers


- insert restaurants to database using create restaurant endpoint
- create new column which will add the mongoId and slug
- approve restaurants using status update endpoint
- verify data of restaurant listeners 
- check in services: [dining-plans, map, restaurants, reviews, subscriptions]
- strict: true in slugify

- make the taxId only unique not the name , fix in modify and restaurant service
- make the cuisine to categories in all database and events
- make the phone number requied in both restaurant (dto and DB)
- make the validations uncomment and proper in restaurant and primary details dto 