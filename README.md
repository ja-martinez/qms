# Queue Management Service

## Database Design

### v2 Postgres

desks
- desk1 
- deskNumber: 1
- client: null or ref to clients

departments 
- id
- name: Insurance

clients 
- id
- department: ref to departments
- called: bool

users 
- joseuid 
- name: Jose
- role: ref to roles

roles 
- adminuid 
- name: admin/agent/kiosk

### v1 Firestore

offices (collection)
- sanluis (document)
  - name: San Luis
  - desks (collection)
    - desk1 (document)
      - deskNumber: 1
      - client: null or ref to clients
  - departments (collection)
    - ins (document)
      - departmentCode: INS
      - name: Insurance
  - clients (collection)
    - client1 (document)
      - clientNumber: 1
      - department: ref to departments
      - called: bool

users (collection)
- joseuid (document)
  - name: Jose
  - role: ref to roles
  - offices: [refs to offices]  **Future

roles (collection)
- adminuid (document)
  - name: admin/agent/kiosk


used this tutorial 
https://www.digitalocean.com/community/tutorials/how-to-build-a-rest-api-with-prisma-and-postgresql#step-2-setting-up-prisma-with-postgresql

** Future
- consider conflict when client sees a desk and is then re-called to another one, so now two desks have the client.
  - solve this by having one-to-one and checking for this error when re-calling client. If a previous desk has that client, set its client to null

auto increment reset
- https://brianchildress.co/reset-auto-increment-in-postgres/

What things will the client need to do?
- admin
  - all roles
  - all users
  - number of desks
  - all departments
- kiosk
  - create new client
- agent dashboard
  - queue up client
    - transaction most recent (lowest number) client that hasn't been called given a department
  - call / re-call client
  - view all clients
  - view all desks
  - view all departments
- display
  - get all desks and their client
  - get most recently queued up client
    - to do this, I was going to get the the called client with greater id, but this won't work for recall
    - I'll need to implement a last_updated timestamp

do i need a queue?
- the transaction will ensure consistency between sql queries
  - for dequeue client
    - get most recent client, change client.called = true, connect it to some desk
  - for re-call
    - check and try to remove client from current desk, connect it to some desk
  - for call
    - check client.called and then forward to dequeue or re-call
  - the transaction will make sure all or none of those things happen (client.called shouldn't be set to true if we fail to connect it to some desk)
- Now what will happen if two transactions are being run concurrently? Does the database handle that appropriately?
  - e.g. two desks dequeue at the same time. We want each one to have a separate client

So I should use websockets?

How can I implement my dequeue function
- use post and rpc style request?
- I think what i need is a controller
- something like POST /desks/:deskId/dequeue

should route handlers return anythin?

TODO:
- error middleware
  - do i need catch blocks?
    - it appears async error handling is a common annoyance with express. People recommend fastify and koa as alternatives.
    - I could use express-async-errors
  - implement error middleware
- I still need to handle all prisma errors that could occur from  connection errors
- manage prisma connection
  - https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections
- should call/recall be a transaction
- should i throw error if client is not found? for dequeue first function and call
- how to retry failed transaction
- do we need version if we have called?
- log actions to console
  - for example, "desk 3 dequeued client 4"
- project structure
  - https://blog.treblle.com/egergr/
  - https://srobbin01.medium.com/node-express-js-project-structure-best-practice-starter-kit-2292364625d3
- auth
  - jwt vs passport vs supertokens vs authjs
  - is there a benefit to using a library like passport vs jwt if I'm only doing email-password?
  - should i use a supertokens server or my own?
  - should i use jwt vs sessions?
    - sessions are more complex to implement because they require a database
    - jwt has issues like not being able to invalidate users
    - I think jwt are good enough for my application 
  - error logging
    - extra console.log ... where is it coming from?
  - networking
    - change hostname

UI
- what happens when you call client and they're in another desk
  - if calling and client is with another desk ask "Are you sure you want to call this client?"
  - or I could just let them call that client and send a toast notification to the previous desk

multiple container organization
- https://www.reddit.com/r/selfhosted/comments/166l4g7/organize_multiple_docker_compose_files/

CURRENT
- What is the server init file? I need to put stuff there for supertokens
- Look at other code window to understand directory structure

we don't need roles. Everyone's a user that can queue/call clients. the admin stuff will be separate.
use stytch for auth because it doesn't require domain

clients will need to connect to a server with the website and the backend server

to authenticate user we can use middleware like in one of the sites i opened and use the same functions as the firebase docs indicate to validate the token. How i extract the token depends on how I send it, i think

OPENING BROWSER AND SIGNING IN FOR KIOSK
use selenium

TODO:
use helmet for express