import { Base64 } from "js-base64";

export const postRunCode = (code: string) => {
  const base64Code = Base64.encode(code);
  return fetch("/api/run", {
    method: "POST",
    body: JSON.stringify({ code: base64Code }),
    headers: {
      "content-type": "application/json"
    }
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data;
    });
}