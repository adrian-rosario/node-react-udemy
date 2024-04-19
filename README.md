# node-react-udemy

Coding along with the Udemy course:

- [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/?couponCode=GENAISALE24)  
  Instructor: **Stephen Grider**

---

## Project Two, ticketing - users, sales, payments

### 19. Header navigation added, SignOut

- `useEffect` used in SignOut for the `/api/users/signout` reqeust

### 19. Passing props through

- once a `getInitialProps` is also added to our custom `AppComponent` (`_app.js`), the `getInitialProps` in `index.js` no longer gets called. This is resolved by calling `appContext.Component.getInitialProps`

- nested context props when a **Custom App** Component is used
  | `getInitialProps` | context |
  | :-: | :-: |
  | **Page** Component | `context==={req, res}` |
  | **Custom App** Component | `context==={Component, ctx: {req, res}}` |
- AppComponent full context: `[ 'AppTree', 'Component', 'router', 'ctx' ]`

### 18. onSuccess callback for Signup added, signed in check

- reminder **https** when testing the cookie :sweat_smile:
- resolved `Error: connect ECONNREFUSED 127.0.0.1:80` for when we call `/api/users/currentuser`. We're calling a service not in our Client or Next container, so the call is not getting routed to the Ingress Nginx Controller. This can be mitigated using `getInitialProps`
- [getInitialProps](https://nextjs.org/docs/pages/api-reference/functions/get-initial-props) is invoked at specific times as per Next

|           request source            | `getInitialProps` execution |
| :---------------------------------: | :-------------------------: |
|          page hard refresh          |           server            |
| clicking link from different domain |           server            |
|      typing URL in address bar      |           server            |
| navigating in **app** between pages |           client            |

- `apiBuildClient` created to handle these requests from inside or outside of the container, a call to the Ingress controller (not our React client) we route the `baseURL` to the ingress controller's name (use `kubectl get services -n ingress-nginx`) and the ingress' namespace (use `kubectl get namespace`). In this case, the configured path is `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local`

### 17. Hook added for network request and error, SignUp

- instead of setting up the post call manually for each network request, a hook has been added so once we define the `url, method, body`, simply call `useRequest()`

### 16. Bootstrap CSS, Axios, Signup form

- `npm install bootstrap`
- `npm install axios` - for making the http requests (POST, GET, etc.)
- Signup form started which utilizes the custom error responses developed earlier for a valid email address and password

### 15. Next added, deployment for React Client configured

- Next added for server side React rendering, Client Deployment and Service are working in cluster

### 14. Global helper signin function

- additional authentication tests added
- tests `setup` set with a global namespace entry for reuse whenever a `signin()` step is needed during unit tests

### 13. index.ts refactoring, unit test setup

- `npm install --save-dev @types/jest @types/supertest jest ts-jest supertest mongodb-memory-server`  
  -- so these aren't deployed to the cluster, in the Dockerfile `--omit=dev`
- refactored so we can test `app` solo, and utilize the ephemeral ports the testing library gives us (ie, we cannot use port 3000 to test `app`)
- Jest setup added, one passing test

### 12. requireAuthentication

- `UnauthorizedError` added, `requireAuthentication` check added and testing successfully in the `currentUserRouter` route (cannot access the path unless user is logged in)

### 11. Augmented type definition, toggled vs-kubernetes resource-limits linter

- added a shared `currentUserCheck` (verify JWT enviroment variable) which includes using `declare global` to modify an existing type definition, in this case, Express' `Request` to add a `currentUser` property
- VS Code preference to dismiss the `yaml` linting warning about `One or more containers do not have resource limits`, use the following in `setting.json`:  
   `"vs-kubernetes": {
    "disable-linters": ["resource-limits"],
    ...
},`

### 10. SignOut added

- setting the `session` to `null` destroys the cookie

### 9. CurrentUser

- establish if user has a cookie with a valid JWT

### 8. SignIn started

- using same pattern of session JWT coded in SignUp
- comparision helper method in PasswordManager for stored and supplied password

### 7. Cookie, Kubernetes Secret, JWT

- session cookie is authored when a User is created (`npm install cookie-session`, `npm install jsonwebtoken` and the `@types`), JSON web token value is written in the cookie
- Kubernetes Secret is utilized for the JWT key
- secret creation example `kubectl create secret generic jwt-secret-name --from-literal=JWT_KEY=xxxxx`
- generate 32 bit string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 6. Password hashing

- before writing to MongoDB, `password` is not longer saved in plain text (login comparison is a later step)

### 5. Bad Request error type added

- existing email check, added `BadRequestError` that can be used with `throw`

### 4. Mongo DB added to deployments, User model added

- created interfaces for mongoose/TypeScript, used those types in the generic definitions, so now we can call User.build({}) and get proper type checking along the way

### 3. Async route error handling implemented

- installed npm package `express-async-errors` to alter the default route handling of `Express`, there will be an `await` added to an `async` route (so we don't have to be confined to using `next()`)

### 2. Common error handling middleware defined

- Error class extended: RequestValidationError, DatabaseConnectionError
- custom errors created, using them in route handler, common formatted response `{errors: {message: string, field?: string}[]}`

### 1. Initial setup, utilizing Skaffold, Google Cloud Build

- integral are the steps needed for deploying an [Ingress Controller](https://kubernetes.github.io/ingress-nginx/deploy/) and [GKE](https://kubernetes.github.io/ingress-nginx/deploy/#gce-gke)

---

## Project One, blog - manually created event bus

### 5. Ingress Controller, local domain redirects, Skaffold config

- added config file for trying out Skaffold, seems to kick off faster than possible and inconsistent services fail during deployment, todo/research
- need to understand/resolve ingress to the client, data is displaying (incorrect)
- resolving exising issue of two routes, a GET and a POST, both to `/posts`, ngnix cannot do routing based on the request method type, so we have to revise to unique paths
- for an ingress controller, use the `apply` command noted in the [nginx ingress controller documentation](https://kubernetes.github.io/ingress-nginx/deploy/#quick-start) (see "If you don't have Helm..."). When done successfully `kubectl get ingress` will display an IP under 'ADDRESS' and requets to `http://posts.com/posts` result in JSON entries posted via postman, use `gcloud compute instances list` to get an external IP for the postman request address, and `kubectl describe services` to find the random port 3xxxx port assigned
- added an entry in local `/etc/hosts` file to redirect `posts.com` requests to the IP of the Ingress controller
- moved all infrastructure files into one folder, thus `kubectl apply -f .` to kick them all off

### 4. Cluster IP Services

- integrated Cluster IP services for the event-bus and posts applications, tested using K8s Service names instead of `localhost` addresses

- having memory and cpu limits in deployment file caused 'minimum cpu' errors when deploying and caused `Pending` instances, commented out generated defaults

### 3. Docker

Testing / utilizing configuration files

- even though the `kubectl k get services` ouput reads as if a 3xxxx port is available, a firewall rule must be added in Google Cloud to open that port to traffic, ie.:
  `gcloud compute firewall-rules create test-node-port \			
--allow tcp:30317`
  - [Google Cloud docs, eposing apps]([https://cloud.google.com/kubernetes-engine/docs/how-to/exposing-apps)

### 2. Approval flow, Moderation service, and Event Syncing

|  Service   | communication | destination |
| :--------: | :-----------: | :---------: |
|   Posts    |      <=>      |  Event Bus  |
|  Comments  |      <=>      |     ""      |
|   Query    |      <=>      |     ""      |
| Moderation |      <=>      |     ""      |

- CommentModerated event
  - id : string
  - content : string
  - postId : string
  - status : 'approved' | 'rejected'
- emitted from the Moderation service
- received inside of Comments service

- Added:

|  Service   | local folder | port |
| :--------: | :----------: | :--: |
| Moderation | /moderation  | 4003 |

Bringing up new services surfaces the strategy of storing events, to run new service/event jobs on previous events. Enter, the Event Sync changes:

1. Store event bus events inside of an array
2. Add endpoint to Event Bus to retrieve all events that have occurred
3. Make sure when Query service is launched it reaches out to the Event Bus to request all events, and the Quer service tries to process that data

There's no persistence here, the exercise is the communication between resources and running our moderation sercie

**Definitely messy business adding or changing events** :persevere:

---

### 1. Initial Event Bus setup

| Service  | communication | destination |
| :------: | :-----------: | :---------: |
|  Posts   |      <=>      |  Event Bus  |
| Comments |      <=>      |     ""      |
|  Query   |      <=>      |     ""      |

- The application example is that of a blog (React front-end, Node microservices) where there can be posts with many comments, the comments will then have an approval flow.

- Event bus example using Express coded by hand and working. The design will not have the vast majority of features a normal bus has. Production grade version will be in a later stage. The Posts, Comments, and Query services all communicate through the event bus.

- Services:
  | Service | local folder | port |
  | :-------: | :----------: | :--: |
  | React | /client | 3000 |
  | Posts | /posts | 4000 |
  | Comments | /comments | 4001 |
  | Query | /query | 4002 |
  | Event Bus | /event-bus | 4005 |

- React project structure
  - App
    - PostList
      - CommentsList
      - CommentsCreate
    - PostCreate
