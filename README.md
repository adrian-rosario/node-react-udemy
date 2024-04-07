# node-react-udemy

Coding along with the Udemy course:

- [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/?couponCode=GENAISALE24)

## Log

### 2. Docker

Testing / utilizing configuration files

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
