import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

// return 404, not found, when ticket doesn't exist
it("returns 404, not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "abcd",
      price: 10,
    })
    .expect(404);
});

// return 401, unauthorized when a user tries to
// update a ticket when not logged in
it("returns 401, unauthorized - not logged in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "abcd",
      price: 10,
    })
    .expect(401);
});

// return 401, unauthorized when a user tries to
// update a ticket they don't own

it("returns 401, unaothorized - not user's ticket", async () => {
  const response = await request(app)
    .put(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "abcd",
      price: 10,
    });

  // access as second user
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "abcdz",
      price: 100,
    })
    .expect(401);
});

// 400, bad request when a user doesn't provide a
// title or price
it("reurns 400, bad request", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "abcd",
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "ten",
      price: -10,
    })
    .expect(400);
});

// 200, update ok
it("returns 200, update OK", async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "abcd",
      price: 10,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "stereo title",
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("stereo title");
  expect(ticketResponse.body.price).toEqual(100);
});
