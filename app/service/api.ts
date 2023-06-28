export const postRunCode = (code: string) => {
  const base64Code = btoa(code);
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