@echo off

rem Open terminal 1 and execute commands
start cmd /k "cd auth && npm update @dine_ease/common"

rem Open terminal 2 and execute commands
start cmd /k "cd users && npm update @dine_ease/common"

rem Open terminal 3 and execute commands
start cmd /k "cd login-gateway && npm update @dine_ease/common"

rem Open terminal 4 and execute commands
start cmd /k "cd mail && npm update @dine_ease/common"

rem Open terminal 5 and execute commands
start cmd /k "cd dining-plans && npm update @dine_ease/common"

rem Open terminal 6 and execute commands
start cmd /k "cd map && npm update @dine_ease/common"

rem Open terminal 7 and execute commands
start cmd /k "cd restaurants && npm update @dine_ease/common"

rem Open terminal 8 and execute commands
start cmd /k "cd reviews && npm update @dine_ease/common"

rem Open terminal 9 and execute commands
start cmd /k "cd notifications && npm update @dine_ease/common"

rem Open terminal 10 and execute commands
start cmd /k "cd subscriptions && npm update @dine_ease/common"