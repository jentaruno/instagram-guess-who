const username = "calvin__liang";

/**
 * Initialized like this so we can still run it from browsers, but also use typescript on a code editor for intellisense.
 */
let mutuals = [{ username: "", full_name: "", id: "", profile_pic_url: "" }];

mutuals = [];

(async () => {
  try {
    console.log(`Process started! Give it a couple of seconds`);

    const userQueryRes = await fetch(
      `https://www.instagram.com/web/search/topsearch/?query=${username}`
    );

    const userQueryJson = await userQueryRes.json();

    const userId = userQueryJson.users
      .map((u) => u.user)
      .filter((u) => u.username === username)[0].pk;

    let after = null;
    let has_next = true;

    const mutualQueryRes = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
        encodeURIComponent(
          JSON.stringify({
            id: userId,
            include_reel: true,
            fetch_mutual: true,
            first: 50,
            after: after,
          })
        )
    );
    const mutualQueryJson = await mutualQueryRes.json();
    mutuals = mutualQueryJson.data.user.edge_mutual_followed_by.edges.map(
      ({ node }) => {
        return {
          username: node.username,
          full_name: node.full_name,
          id: node.id,
          profile_pic_url: node.profile_pic_url,
        };
      }
    );

    console.log({ mutuals });

    console.log(
      `Process is done: Type 'copy(mutuals)' in the console and paste it into a text editor to take a look at it'`
    );
  } catch (err) {
    console.log({ err });
  }
})();
