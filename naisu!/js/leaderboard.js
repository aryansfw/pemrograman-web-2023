const leaderboard = document.getElementById("leaderboard");

leaderboardButton.onclick = () => {
  showMenu(leaderboardMenu);
  leaderboard.innerHTML = "";
  fetch("https://ets-pemrograman-web-f.cyclic.app/scores/score", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        alert("Failed to get leaderboard data");
      }
      return response.json();
    })
    .then((response) => {
      const leaderboardData = response.data.sort((a, b) => b.score - a.score);

      for (let i = 0; i < 3; i++) {
        const ranking = document.createElement("div");
        ranking.textContent = `${i + 1}. ${leaderboardData[i].nama} - ${
          leaderboardData[i].score
        }`;

        leaderboard.appendChild(ranking);
      }
    })
    .catch((error) => {
      alert(error);
    });
};
