@echo off

@REM rem Open terminal 1 and execute commands
@REM start cmd /k "cd auth && npm run start:dev"

@REM rem Open terminal 2 and execute commands
@REM start cmd /k "cd users && npm run start:dev"

@REM rem Open terminal 3 and execute commands
@REM start cmd /k "cd login-gateway && npm run start:dev"

@REM rem Open terminal 4 and execute commands
@REM start cmd /k "cd mail && npm run start:dev"

@REM rem Open terminal 5 and execute commands
@REM start cmd /k "cd dining-plans && npm run start:dev"

@REM rem Open terminal 6 and execute commands
@REM start cmd /k "cd map && npm run start:dev"

@REM rem Open terminal 7 and execute commands
@REM start cmd /k "cd restaurants && npm run start:dev"

@REM rem Open terminal 8 and execute commands
@REM start cmd /k "cd reviews && npm run start:dev"

@REM rem Open terminal 9 and execute commands
@REM start cmd /k "cd notifications && npm run start:dev"

@REM rem Open terminal 10 and execute commands
@REM start cmd /k "cd subscriptions && npm run start:dev"

rem Open terminal 11 and execute commands
start cmd /k "kubectl port-forward nats-depl-5f6446768c-dc55p 4222:4222"

rem Open terminal 12 and execute commands
start cmd /k "kubectl port-forward restaurants-redis-depl-75c775cb6d-5tlqg 6379:6379"

rem Open terminal 13 and execute commands
start cmd /k "kubectl port-forward notifications-redis-depl-5d469478bd-cr7mp 6380:6380"

rem Open terminal 14 and execute commands
start cmd /k "kubectl port-forward meilisearch-depl-69c9c99464-vb8v7 7700:7700"