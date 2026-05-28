const baseURL = "https://api.github.com/search/users"

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
      fetch(baseURL + `?q=${keyword}`, {
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
      const resultCard = document.createElement('div')
      const resultPFP = document.createElement("img")
      const resultUser = document.createElement('p')
      const resultURL = document.createElement('a')

      
      resultPFP.src = result.avatar_url
      resultPFP.alt = 'User Profile Picture'
      resultCard.id = 'resultCard'
      resultUser.textContent = result.login
      resultURL.textContent = "Profile Link"
      resultURL.href = result.url

      resultCard.append(resultPFP, resultUser, resultURL)
      resultLi.append(resultCard)

      userList.append(resultLi)
    }
  }
  if (type == "repo") {
  }
}
