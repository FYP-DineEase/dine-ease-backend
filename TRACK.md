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
- review service : images upload/delete
- payment creation remaining in subscription service and expiry
- AI integration and NLP of review

- rate limit on check restaurant duplication and other checking endpoints

- update jwt values to 7d later 
- fix validations ( DTOs ) { min max etc } and their redundancy and error messages
- uncomment twilio sendOTP

- remove the mongo-secret since data will be stored locally , 
    currently on VM close data gets lost, so storing it in a cloud