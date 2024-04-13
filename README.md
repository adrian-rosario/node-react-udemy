# node-react-udemy

Coding along with the Udemy course:

- [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/?couponCode=GENAISALE24)

## Project Two, ticketing - users, sales, payments

### 10. SignOut added

### 9. CurrentUser

- establish if user has a cookie with a valid JWT

### 8. SignIn started

- using same pattern of using session JWT as the SignUp
- comparision helper method for stored and supplied password

### 7. Cookie, Kubernetes Secret, JWT

- session cookie is authored when a User is created (`npm install cookie-session`, `npm install jsonwebtoken` and the `@types`), JSON web token value is written in the cookie
- Kubernetes Secret is utilized for the JWT key

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
