async function createRoom() {
  const exp = Math.round(Date.now() / 1000) + 60 * 30;
  const options = {
    properties: {
      exp,
    },
  };

  const response = await fetch("https://api.daily.co/v1/rooms/", {
    method: "POST",
    body: JSON.stringify(options),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.DAILY_API_KEY,
    },
  });

  return await response.json();
}

export async function POST(request) {
  const res = await createRoom();
  return Response.json(res);
}
