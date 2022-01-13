let changelog_containers = document.getElementById('changelog-containers')
const changelog = [
    {
        "version": "1.0",
        "notes": "Création of the website",
        "details":[
            "Adding the functionnality : Import file",
            "Adding the functionnality : Auto translation",
            "Adding the functionnality : Adding Containers",
            "Adding the functionnality : Adding Keys",
            "Adding the functionnality : Selections of the language",
            "Adding the functionnality : Adding custom languages"
        ]
    }
]

for(let i = 0; i <= changelog.length - 1; i++){
    let change = changelog[i];

    let element = document.createElement('div')

    element.innerHTML = `<p class="h4 py-2">Version ${change.version}</p>
    <p class="h6">Notes : ${change.notes}</p>`
    let string = '';
    change.details.forEach((detail) => {
        string = `${string}<li>${detail}</li>`
    })
    let ul = document.createElement('ul')
    ul.innerHTML = string
    element.appendChild(ul)
    changelog_containers.appendChild(element)
}
