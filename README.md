# node-react-udemy

Coding along with the Udemy course:

- [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/?couponCode=GENAISALE24)

## Log

### 1. Initial setup

- Event bus example using Express coded by hand and working. The design will not have the vast majority of features a normal bus has. Production grade version will be in a later stage. The Posts, Comments, and Query services all communicate through the event bus.

  - Services are as follows:
    - /client - React
      - port: 3000
    - /posts
      - port: 4000
    - /comments
      - port: 4001
    - /query
      - port: 4002
    - /event-bus
      - port: 4005

- React project structure
  - App
    - PostList
      - CommentsList
      - CommentsCreate
    - PostCreate
