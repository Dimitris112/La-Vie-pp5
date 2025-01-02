import { rest } from "msw";

const baseURL = "https://la-vie-pp5-c334770967ef.herokuapp.com/"; // axiosDefault.js

export const handlers = [
  // request - response - context
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 5,
        username: "Dim",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 5,
        profile_image:
          "https://res.cloudinary.com/ds7kwvkc6/image/upload/v1/media/../default_profile_k0eomt",
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
