const baseURL = "https://api.github.com/"

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("github-form")
  const searchBar = document.querySelector('input[name="search"]')
  //only allow alpha-numeric/hyphen inputs
  searchBar.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9\-]/g, "")
  })

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const keyword = new FormData(e.target).get("search")
    const queryDiv = document.getElementById("queryDiv")
    const keywordDiv = document.getElementById("keywordBold")
    // console.log(new FormData(e.target))
    if (keyword != "" && keyword != undefined) {
      fetch(`${baseURL}search/users?q=${keyword}&per_page=15`, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })
        .then((res) => res.json())
        .then((results) => {
          displayResults(results.items, "user")
          queryDiv.innerHTML = `${results.total_count} results for <b>${keyword}</b>.`
        })
    }
  })
})

function displayResults(results, type) {
  console.log(results)
  if (type == "user") {
    const userList = document.getElementById("user-list")
    userList.replaceChildren()

    for (result of results) {
      const resultLi = document.createElement("li")
      const resultCard = document.createElement("div")
      const resultPFP = document.createElement("img")
      const resultUser = document.createElement("p")
      const resultURL = document.createElement("a")

      resultPFP.src = result.avatar_url
      resultPFP.alt = "User Profile Picture"
      resultCard.classList.add("resultCard")
      resultUser.textContent = result.login
      resultURL.textContent = "Profile Link"
      resultURL.href = result.html_url
      resultURL.target = "_blank"
      resultURL.rel = "noopener noreferrer"

      resultCard.append(resultPFP, resultUser, resultURL)
      resultCard.id = result.login
      resultCard.addEventListener("click", (e) => {
        console.log(e.target.id + " clicked")
        const repoList = document.getElementById("repos-list")

        const repoLi = document.createElement("li")
        const repoCard = document.createElement("div")
        const repoName = document.createElement("p")
        const repoLang = document.createElement("p")
        const repoCreatedAt = document.createElement("p")
        const repoURL = document.createElement("a")

        const fetchRepoData = async () => {
          try {
            console.log('fetching data')
            const [res1, res2] = await Promise.all([
              fetch(baseURL + `users/${resultCard.id}`, {
                method: "GET",
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }),
              fetch(baseURL + `users/${resultCard.id}/repos`, {
                method: "GET",
                headers: {
                  Accept: "application/vnd.github.v3+json",
                },
              }),
            ])

            const userData = await res1.json()
            const repoData = await res2.json()
            console.log(userData)
            console.log(repoData)

            const repoQuery = document.getElementById("repoQuery")
            repoQuery.innerHTML = `<b>${resultCard.id}</b> has ${userData.public_repos} repositories.`

            for (repo of repoData) {
              console.log(repo)
              repoCard.id = repo.full_name
              repoName.textContent = repo.name
              repoCreatedAt.textContent = `Date Created: ${repo.created_at.slice(0, 10)}`
              repoURL.textContent = "Repo Link"
              repoCard.href = repo.html_url
              resultURL.target = "_blank"
              resultURL.rel = "noopener noreferrer"
              repoLang.textContent = `Language: ${repo.language}`

              repoCard.append(repoName, repoLang, repoCreatedAt, repoURL)
              repoLi.append(repoCard)

              repoList.append(repoLi)
            }
          } catch (err) {
            console.error(err)
          }
        }

        fetchRepoData()
      })
      resultLi.append(resultCard)

      userList.append(resultLi)
    }
  }
  if (type == "repo") {
  }
}
