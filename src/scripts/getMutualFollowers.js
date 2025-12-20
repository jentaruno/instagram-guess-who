import browser from "webextension-polyfill";

const errorName = "IgError";

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

async function imageUrlToBase64(url) {
  const response = await fetch(url);
  console.log(response);
  const blob = await response.blob();
  return new Promise((onSuccess) => {
    const reader = new FileReader();
    reader.onload = function () {
      onSuccess(this.result);
    };
    reader.readAsDataURL(blob);
  });
}

async function getOwnUsername() {
  try {
    return fetch("https://www.instagram.com/accounts/edit/", {
      credentials: "include",
    })
      .then((response) => response.text())
      .then((text) => {
        return text.match(/"username":"(.*?)"/)?.[1];
      });
  } catch (err) {
    const e = new Error(`Error while getting own username: ${err.message}`);
    e.name = errorName;
    throw e;
  }
}

// adapted from https://stackoverflow.com/a/74133719
async function getMutuals(username) {
  try {
    console.log(`Process started! Give it a couple of seconds`);

    const userQueryRes = await fetch(
      `https://www.instagram.com/web/search/topsearch/?query=${username}`
    );
    const ownUsername = await getOwnUsername();
    if (username === ownUsername) {
      // throw error for trying your own username
      const e = new Error("Enter a friend's Instagram username, not your own.");
      e.name = errorName;
      throw e;
    }

    const userQueryJson = await userQueryRes.json();
    console.log(userQueryJson);
    let searchedUsers;
    let userId;
    try {
      searchedUsers = userQueryJson.users.map((u) => u.user);
    } catch {
      // presumably not logged in
      const e = new Error("Instagram search failed, are you logged in?");
      e.name = errorName;
      throw e;
    }
    try {
      userId = searchedUsers.filter((u) => u.username === username)[0].pk;
    } catch {
      // could not find user with given username
      const e = new Error(
        `Failed to find user "${username}", did you make a typo?`
      );
      e.name = errorName;
      throw e;
    }
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
    const mutualFollowers = await Promise.all(
      mutualFollowerQueryJson.data.user.edge_mutual_followed_by.edges.map(
        async ({ node }) => {
          const pic = await imageUrlToBase64(node.profile_pic_url);
          return {
            username: node.username,
            full_name: node.full_name,
            id: node.id,
            profile_pic: pic,
          };
        }
      )
    );
    mutualFollowers.sort((a, b) => {
      const nameA = a.username.toUpperCase(); // Ignore case for comparison
      const nameB = b.username.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    console.log(mutualFollowers);

    // send extension filtered mutuals from the page
    browser.runtime.sendMessage({
      type: "mutuals",
      mutuals: mutualFollowers,
      username: ownUsername,
    });

    console.log("Done with getting mutuals!");
  } catch (err) {
    if (err.name === errorName) {
      browser.runtime.sendMessage({ type: "error", error: err.message });
    } else {
      browser.runtime.sendMessage({
        type: "error",
        error: `Encountered an unknown error. ${err.name}: ${err.message}. Try again?`,
      });
    }
  }
}
