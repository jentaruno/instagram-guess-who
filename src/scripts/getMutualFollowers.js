import browser from "webextension-polyfill";

// run when instagram page loads to communicate back to page that we're ready
function runOnPageLoad() {
  console.log("loaded");
  browser.runtime.sendMessage({ type: "ready" });
}

if (document.readyState !== "loading") {
  runOnPageLoad();
} else {
  document.addEventListener("DOMContentLoaded", runOnPageLoad);
}

browser.runtime.onMessage.addListener((data) => {
  if (data.msg === "get-mutuals") {
    console.log("hi");
    getMutuals(data.username);
  }
});

// adapted from https://stackoverflow.com/a/74133719
async function getMutuals(username) {
  try {
    console.log(`Process started! Give it a couple of seconds`);

    const userQueryRes = await fetch(
      `https://www.instagram.com/web/search/topsearch/?query=${username}`
    );

    const userQueryJson = await userQueryRes.json();

    const userId = userQueryJson.users
      .map((u) => u.user)
      .filter((u) => u.username === username)[0].pk;

    // we're only fetching the first mutuals that the query returns
    // during testing it's always fit into one query and returns plenty of mutual followers
    const mutualFollowerQueryRes = await fetch(
      `https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables=` +
        encodeURIComponent(
          JSON.stringify({
            id: userId,
            include_reel: true,
            fetch_mutual: true,
            first: 50,
            after: null,
          })
        )
    );
    const mutualFollowerQueryJson = await mutualFollowerQueryRes.json();
    const mutualFollowers =
      mutualFollowerQueryJson.data.user.edge_mutual_followed_by.edges.map(
        ({ node }) => {
          return {
            username: node.username,
            full_name: node.full_name,
            id: node.id,
            profile_pic_url: node.profile_pic_url,
          };
        }
      );

    console.log(mutualFollowers);

    // get friend's following
    // initialized like this so it still runs in browsers, but also still has intellisense
    let followings = [
      { username: "", full_name: "", id: "", profile_pic_url: "" },
    ];
    followings = [];
    let after = null;
    let has_next = true;

    while (has_next) {
      await fetch(
        `https://www.instagram.com/graphql/query/?query_hash=d04b0a864b4b54837c0d870b0e77e076&variables=` +
          encodeURIComponent(
            JSON.stringify({
              id: userId,
              include_reel: true,
              fetch_mutual: true,
              first: 50,
              after: after,
            })
          )
      )
        .then((res) => res.json())
        .then((res) => {
          has_next = res.data.user.edge_follow.page_info.has_next_page;
          after = res.data.user.edge_follow.page_info.end_cursor;
          followings = followings.concat(
            res.data.user.edge_follow.edges.map(({ node }) => {
              return {
                username: node.username,
                full_name: node.full_name,
                id: node.id,
                profile_pic_url: node.profile_pic_url,
              };
            })
          );
        });
    }

    console.log({ followings });

    // filter for mutuals that the friend is following
    const filteredMutuals = mutualFollowers.filter((follower) => {
      return followings.find(
        (following) => follower.username === following.username
      );
    });
    console.log(filteredMutuals);

    // send extension filtered mutuals from the page
    browser.runtime.sendMessage({ type: "mutuals", mutuals: filteredMutuals });

    console.log("Done with getting mutuals!");
  } catch (err) {
    browser.runtime.sendMessage({ type: "error", error: err.stack });
  }
}
