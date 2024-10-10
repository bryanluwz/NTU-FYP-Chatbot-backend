import {
  PostQueryMessageApiRequestModel,
  PostQueryMessageApiResponseModel,
} from "./typings";
import { postQueryMessageUrl } from "./urls";

export const postQueryMessageApi = async (
  data: PostQueryMessageApiRequestModel
) => {
  return (
    await fetch(postQueryMessageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).json() as unknown as PostQueryMessageApiResponseModel;
};
