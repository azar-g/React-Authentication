const PostData = async (reqBody, APIKEY) => {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`,
    {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "content-type": "application/json",
      },
    }
  );
  const data = await response.json();

  if (!response.ok) throw Error(data.error.message);

  return data;
};

export default PostData;
