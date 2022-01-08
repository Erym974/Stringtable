let preview_text = document.getElementById("preview_text");
let preview_list = document.getElementById("preview_list");

let stringtable = {
    "project_name": "Project",
    "package_name": "Package"
}
let containers = []
let languages = ["English"];
let all_languages = []

const UpdateTextPreview = () => {


    preview_text.value = `<?xml version="1.0" encoding="UTF-8" ?>
<Project name="${stringtable.project_name}">
    <Package name="${stringtable.package_name}">`
        
    containers.forEach((container) => {
        preview_text.value = `${preview_text.value}
        <Container name="${container.name}">`
        container.Keys.forEach((key) => {
            preview_text.value = `${preview_text.value}
                <Key ID="${key.name}">`
                    Object.keys(key.key_content).forEach((language) => {
                        preview_text.value = `${preview_text.value}
                        <${language}>${key.key_content[language]}</${language}>`
                    })
                preview_text.value = `${preview_text.value}
                </Key>`
        })
        preview_text.value = `${preview_text.value}
        </Container>`
    })

    preview_text.value = `${preview_text.value}
    </Package>
</Project>`;


    
    setTimeout(function(){
        preview_text.style.cssText = 'height:auto; padding:0';
        preview_text.style.cssText = 'height:' + preview_text.scrollHeight + 'px';
    },0);
}

const UpdateListPreview = () => {

    preview_list.innerHTML = `
<ul>
    <li>
        ${stringtable.project_name}
        <ul>
            <li>
            ${stringtable.package_name}
                <ul id="container_parent">
                    
                </ul>
            </li>
        </ul>
    </li>
</ul>
`

let container_parent = document.getElementById('container_parent');

containers.forEach((container) => {
    let element = document.createElement('li');
    element.innerHTML = `${container.name} <i onclick="DeleteContainer('${container.name}')" class="delete fas fa-times ps-1"></i>`

    let key_container = document.createElement('ul');
    (container.Keys).forEach((key) => {
        let element_key = document.createElement('li');
        element_key.addEventListener('click', () => {
            KeyItemTab(element_key)
        })
        element_key.classList.add('key_li')
        element_key.setAttribute('value', key.name)
        element_key.innerHTML = `${key.name} <i onclick="DeleteKey('${container.name}', '${key.name}')" class="delete fas fa-times ps-1"></i>`

        key_container.appendChild(element_key)
    })

    element.appendChild(key_container)
    container_parent.appendChild(element)

})

}

const DeleteContainer = (container_name) => {
    containers.forEach((container, index) => {
        if(container_name == container.name){
            containers.splice(index, 1)
        }
    })

    UpdateContainerDrop();
    UpdatePreviews()
}

const DeleteKey = (container_name, key_name) => {
    containers.forEach((container) => {
        if(container_name == container.name){
            container.Keys.forEach((container_key, index) => {
                if(container_key.name == key_name){

                    let preview_list_tab = document.getElementById('preview_list_tab')

                    preview_list_tab.style.display = "none";
                    preview_list_tab.innerHTML = "";

                    (container.Keys).splice(index, 1)
                }
            });
        }
    })

    UpdatePreviews()
}

const TableEdit = (cell, language, key_name) => {
    let key = null;

    containers.forEach((container) => {
        container.Keys.forEach((container_key) => {
            if(container_key.name == key_name){
                key = container_key
            }
        });
    })

    key.key_content[language] = cell.innerText

    UpdatePreviews();
}

const KeyItemTab = (li) => {
    
    let preview_list_tab = document.getElementById('preview_list_tab')

    preview_list_tab.style.display = "block"

    let tableBody = document.getElementById('table-body')
    if(tableBody != null){
        tableBody.innerHTML = ""

        let key = null;
    
    
        containers.forEach((container) => {
            container.Keys.forEach((container_key) => {
                if(container_key.name == li.getAttribute('value')){
                    key = container_key
                }
            });
        })
    
        Object.keys(key.key_content).forEach((ky) => {
            tableBody.innerHTML = `${tableBody.innerHTML}
            <tr>
            <th scope="row">${ky}</th>
            <td contenteditable="true" onkeyup="TableEdit(this, '${ky}', '${li.getAttribute('value')}')">${key.key_content[ky]}</td>
            </tr>`
        })
    }

}



const UpdatePreviews = () => {
    UpdateTextPreview();
    UpdateListPreview();
}

const CreateContainer = (button) => {
    if((document.getElementById('container_name').value).replaceAll(' ', '_') != ""){
        let container_name = (document.getElementById('container_name').value).replaceAll(' ', '_');
        let container = new Container(container_name)
        document.getElementById('container_name').value = "";
        ButtonCreateContainerClicked(button, 'success');
        containers.push(container)
        UpdatePreviews();
    } else {
        ButtonCreateContainerClicked(button, 'danger');
    }
    UpdateContainerDrop();
}

const CreateKey = (button) => {
    let key_name = document.getElementById('key_name')
    let language_select = document.getElementById('starting_language')
    let container_select = document.getElementById('container_list')

    if(key_name.value.includes(' ')){ButtonCreateKeyClicked(button, 'danger', 'Spacing in Key name are not allowed '); return;}
    if(key_name.value == ""){ButtonCreateKeyClicked(button, 'danger', 'You need to put a name'); return;}
    if(container_select.value == ""){ButtonCreateKeyClicked(button, 'danger', 'You need to link a container'); return;}
    if(language_select.value == ""){ButtonCreateKeyClicked(button, 'danger', 'You need to choose a starting language'); return;}

    let container = null;
    let next = true;

    containers.forEach((cont) => {
        if(cont.name == container_select.value){
            container = cont;
        }
        cont.Keys.forEach((key) => {
            console.log(`${key.name} -- ${key_name.value}`);
            if(key.name == key_name.value){next = false; ButtonCreateKeyClicked(button, 'danger', 'This key name is already used'); return;}
        })
    })

    if(next){
        let key_content = {};

        languages.forEach((language) => {
            if(language == language_select.value){
                key_content['Original'] = document.getElementById(`langue-selected-${language}`).value;
            }
        })  
    
        languages.forEach((language) => {
            key_content[language] = document.getElementById(`langue-selected-${language}`).value
        })  
    
        container.CreateKey(key_name.value, key_content, language_select.value)
    
        UpdatePreviews()
    }

}

ResetKey = () => {
    let container_list = document.getElementById('container_list')
    container_list.innerHTML = '<option value="null">None</option>';
    container_list.disabled = true;

    document.getElementById('key_name').value="STR_"
    document.getElementById('key_name').disabled=true;
    
    document.getElementById('starting_language').disabled=true;

    languages.forEach((lang) => {
        document.getElementById(`langue-selected-${lang}`).disabled = true;
        document.getElementById(`langue-selected-${lang}`).value = "";
    })
    

}

UpdateContainerDrop = () => {

    let container_list = document.getElementById('container_list')
    container_list.innerHTML = "";

    containers.forEach((container) => {
        let element = document.createElement('option');
        element.setAttribute('value', container.name)
        element.innerText = container.name;
        container_list.appendChild(element)
    })

    if(containers.length >= 1){
        document.getElementById('form_key').innerHTML = (document.getElementById('form_key').innerHTML).replaceAll('disabled', '')

        let key_name = document.getElementById('key_name')
        key_name.value = `STR_${(container_list.value).toUpperCase().replaceAll('_', '')}_`
    }

    if(containers.length == 0){
        ResetKey();
    }
}

const link_to_change = (value) => {
    let key_name = document.getElementById('key_name')

    key_name.value = `STR_${(value.value).toUpperCase()}_`
}

const downloadFile = (button) => {
    let stringtable = preview_text.value;
    download("Stringtable.xml", stringtable)
    ButtonDownloadClicked(button)
}

function download(file_name, file_content){

    let element = document.createElement('a');
    element.style.display = 'none';

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file_content));
    element.setAttribute('download', file_name);
    document.body.appendChild(element)

    element.click();
    document.body.remove(element)

}

const CopyToClipboard = (button) => {
    preview_text.select();
    document.execCommand('copy')
    window.getSelection().removeAllRanges();
    ButtonCopiedClicked(button);
}

const EditPreviewText = (button) => {
    if(preview_text.disabled){
        preview_text.disabled = false;
        button.innerHTML = 'Save change <i class="far fa-save ps-1"></i>'
    } else {
        preview_text.disabled = true;
        button.innerHTML ='Manual edit <i class="far fa-edit ps-1"></i>'
    }
}

const InitFormUpdate = () => {
    
    project_input = document.getElementById('project_name')
    package_input = document.getElementById('package_name')
    container_input = document.getElementById('container_name')

    inputs = [project_input, package_input, container_input];

    inputs.forEach((input) => {
        input.onkeyup = () => {
            stringtable[input.getAttribute("id")] = input.value.replaceAll(' ', '_');
            UpdatePreviews();
        }
        input.addEventListener('change', () => {
            if(input.value == ""){
                input.value = "Default"
                stringtable[input.getAttribute("id")] = "Default"
                UpdatePreviews();
            }
        })
    })

}

const LanguageCheck = (check) => {

    
        if(languages.includes(check.value)){
            if(languages.length == 1){
                document.getElementById('checkbox_en').checked = true;
                document.getElementById('checkbox-lang-alert').style.display = "block"
                setTimeout(function(){
                    document.getElementById('checkbox-lang-alert').style.display = "none"
                }, 4000)
            } else {
                languages.splice(languages.indexOf(check.value), 1)
            }
        } else {
            languages.push(check.value)
        }

    document.getElementById('keys-languages').innerHTML = "";
    languages.forEach((lang) => {
        document.getElementById('keys-languages').innerHTML = `${document.getElementById('keys-languages').innerHTML}
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="language-${lang}-label">${lang}</span>
            </div>
            <input type="text" name="${lang.toLowerCase}" class="form-control" id="langue-selected-${lang}" aria-describedby="language-${lang}-label">
        </div>
        `
    })

    document.getElementById('starting_language').innerHTML = "";
    languages.forEach((lang) => {
        document.getElementById('starting_language').innerHTML = `${document.getElementById('starting_language').innerHTML}
        <option value="${lang}">${lang}</option>`
    })

}

const CreateLanguages = (custom_language) => {

    let custom_language_minus = (custom_language[0] + custom_language[1] + custom_language[3]).toLowerCase()


    let checkbox_containers = document.getElementById('checkbox-containers');

    checkbox_containers.innerHTML = `${checkbox_containers.innerHTML}
    <div class="form-check">
    <input class="form-check-input" type="checkbox" value="${custom_language}" id="checkbox_${custom_language_minus}" onclick="LanguageCheck(this)">
    <label class="form-check-label" for="checkbox_${custom_language_minus}">
        ${custom_language}
    </label>
    </div>`
}

const AddLanguage = (button) => {

    let custom_language = document.getElementById('custom_language')
    
    if(custom_language.value == ""){ButtonAddLanguageClicked(button, 'danger', 'You need to name your custom language'); return;}
    if(all_languages.includes(custom_language.value)){ButtonAddLanguageClicked(button, 'danger', 'This language is already declared'); return;}
    if(custom_language.value == "Original"){ButtonAddLanguageClicked(button, 'danger', 'This language is reserved for Stringtable'); return;}
    custom_language.value = custom_language.value.replaceAll(' ', '')
    all_languages.push(custom_language.value)
    CreateLanguages(custom_language.value);

    ButtonAddLanguageClicked(button, 'success')
}

document.getElementById('form_container').addEventListener('submit', (event) => {
    event.preventDefault();
    container_name = document.getElementById('container_name').value
})

document.getElementById('form_general').addEventListener('submit', (event) => {
    event.preventDefault();
    project_name = document.getElementById('project_name').value
    package_name = document.getElementById('package_name').value
})

document.getElementById('form_key').addEventListener('submit', (event) => {
    event.preventDefault();
})

window.addEventListener('load', () => {
    UpdatePreviews();
    InitFormUpdate();
    all_languages.push("English", "French", "Russian","Spanish","Italian","Polish","Portuguese","Russian","Korean","Japanese","Chinese", "Turkish");

    ["French", "Russian","Spanish","Italian","Polish","Portuguese","Russian","Korean","Japanese","Chinese", "Turkish"].forEach((lang) => {
        CreateLanguages(lang)
    })
})


