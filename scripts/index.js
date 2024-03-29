const now = new Date()
const expirate = now.getTime() + (1*60*60*1000)

let preview_text = document.getElementById("preview_text");
let preview_list = document.getElementById("preview_list");

let stringtable = {}
let containers = []
let languages = ["English"];
let all_languages = ["English", "French", "Russian","Spanish","Italian","Polish","Portuguese","Russian","Korean","Japanese","Chinese", "Turkish"]
let deepl_auth = "";

function UpdateTextPreview(){

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

function UpdateListPreview(){

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

function DeleteContainer(container_name){
    containers.forEach((container, index) => {
        if(container_name == container.name){
            containers.splice(index, 1)
        }
    })

    UpdateContainerDrop();
    UpdatePreviews()
}

function TranslateKey(button){
    ButtonTranslateClicked(button, 'loading');

    let original_language = document.getElementById('starting_language').value;
    let key_to_translate = document.getElementById(`langue-selected-${original_language}`).value

    if(key_to_translate == ""){ButtonTranslateClicked(button, 'error', 'Original key can\'t be null'); return;}
    if(languages.length == 1){ButtonTranslateClicked(button, 'error', 'There are no other languages'); return;}

    languages.forEach((language, index) => {
        
        if(language != original_language){
            if(button.getAttribute('data-translate') == 'error-403'){ButtonTranslateClicked(button, 'error', 'Auth key is invalid');return;}
            TranslateText(key_to_translate, language, document.getElementById(`langue-selected-${language}`), button)
        }

        if(index == languages.length - 1){
            ButtonTranslateClicked(button, 'success')
        }

    })

}

function TranslateText(text, language, input, button){

    let exit = false;

    switch(language){
        case "French":
            language = "fr"
            break
        case "English":
            language = "en"
            break
        case "Russian":
            language = "ru"
            break
        case "Spanish":
            language = "es"
            break
        case "Italian":
            language = "it"
            break
        case "Polish":
            language = "pl"
            break
        case "Chinese":
            language = "zh"
            break
        case "Portuguese":
            language = "pt"
            break
        case "Japanese":
            language = "ja"
            break
        case "German":
            language = "de"
            break
        default:
            exit = true;
            break;
        }

    if(exit){return;}
    if(button.getAttribute('data-translate') == 'error-403'){ButtonTranslateClicked(button, 'error', 'Auth key is invalid');return;}
        
    fetch(`https://api-free.deepl.com/v2/translate?auth_key=${deepl_auth}&text=${text}&target_lang=${language}`)
    .then(function(res) {
        if(res.ok){
            res.json().then(datas => {
                input.value = datas.translations[0].text;
            })
        } else {
            button.setAttribute('data-translate', 'error-403')
        }
    })

}

function UpdateDeeplAuthAPI(input){
    deepl_auth = input.value;
    setWithExpiry('deepl_auth', deepl_auth)
    if(deepl_auth != ""){
        document.getElementById('translate_button').style.display = "block";
    } else {
        document.getElementById('translate_button').style.display = "none";
    }
}

function DeleteKey(container_name, key_name){
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

function TableEdit(cell, language, key_name){
    let key = null;

    containers.forEach((container) => {
        container.Keys.forEach((container_key) => {
            if(container_key.name == key_name){
                key = container_key
            }
        });
    })

    SaveContainer();

    key.key_content[language] = cell.innerText

    UpdatePreviews();
}

function KeyItemTab(li){
    
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

function setWithExpiry(key, value){
	const item = {
		value: value,
		expiry: expirate,
	}
	localStorage.setItem(key, JSON.stringify(item))
}

function getWithExpiry(key){
	const itemStr = localStorage.getItem(key)
	if (!itemStr) {
		return null
	}
	const item = JSON.parse(itemStr)
	const now = new Date()
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key)
		return null
	}
	return item.value
}

function UpdatePreviews(){
    UpdateTextPreview();
    UpdateListPreview();
}

function CreateContainer(button){
    if((document.getElementById('container_name').value).replaceAll(' ', '_') != ""){
        let container_name = (document.getElementById('container_name').value).replaceAll(' ', '_');
        let container = new Container(container_name)
        document.getElementById('container_name').value = "";
        ButtonCreateContainerClicked(button, 'success');
        containers.push(container)
        UpdatePreviews();
        SaveContainer();
    } else {
        ButtonCreateContainerClicked(button, 'danger');
    }

    UpdateContainerDrop();
}

function CreateKey(button){
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
            if(key.name == key_name.value){next = false; ButtonCreateKeyClicked(button, 'danger', 'This key name is already used'); return;}
        })
    })

    ButtonCreateKeyClicked(button, 'success')

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
    
        container.CreateKey(key_name.value, key_content)
        SaveContainer();
    }

}

function ResetKey(){
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

function UpdateContainerDrop(){

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

function link_to_change(value){
    let key_name = document.getElementById('key_name')

    key_name.value = `STR_${(value.value).toUpperCase()}_`
}

function downloadFile(button){
    let stringtable = preview_text.value;
    download("Stringtable.xml", stringtable)
    ButtonDownloadClicked(button)
}

function ImportFile(button){
    let input = document.getElementById('import_stringtable')

    if(input.files.length == 0){ButtonImportFileClicked(button, 'danger', 'No file have been choosen'); return}
    if(input.files.length > 1){ButtonImportFileClicked(button, 'danger', 'Multiple files are not allowed'); return}
    if(input.files[0].type != "text/xml"){ButtonImportFileClicked(button, 'danger', 'Only xml files are allowed'); return}

    let file = input.files[0]

    let file_content = ""; 
    const reader = new FileReader()
    reader.onload = function(e) {
        file_content = e.target.result 
        if(!file_content.includes("Project") && !file_content.includes("Package") && !file_content.includes('<?xml')){ButtonImportFileClicked(button, 'danger', 'This file is not a stringtable file'); return}

        let StringTableFile = document.createElement('div')
        StringTableFile.innerHTML = file_content

        stringtable.project_name = StringTableFile.querySelector('project').getAttribute('name');
        stringtable.package_name = StringTableFile.querySelector('package').getAttribute('name');

        document.getElementById('project_name').value = StringTableFile.querySelector('project').getAttribute('name');
        document.getElementById('package_name').value = StringTableFile.querySelector('package').getAttribute('name');

        setWithExpiry('stringtable', JSON.stringify(stringtable))

        containers = [];

        StringTableFile.querySelectorAll('container').forEach((container_element) => {

            let container = new Container(container_element.getAttribute('name'))
            container_element.querySelectorAll('key').forEach((key_element) => {
                let key_content = {}
                for(let i = 0; i <= key_element.children.length - 1; i++){
                    let language = `${key_element.children[i].tagName[0]}${key_element.children[i].tagName.slice(1).toLowerCase()}`
                    key_content[language] = key_element.children[i].innerText
                }
                container.CreateKey(key_element.getAttribute('id'), key_content)
            })
            containers.push(container)
        })

        ButtonImportFileClicked(button, 'success')

        SaveContainer()
        UpdatePreviews()

    }
    reader.onerror = error => reject(error)
    reader.readAsText(file);
    
}

function ResetDatas(button){
    stringtable = {
        "project_name": "Project",
        "package_name": "Package"
    }   
    containers = [] 
    deepl_auth = "";

    setWithExpiry('stringtable', stringtable)
    setWithExpiry('containers', '')
    setWithExpiry('deepl_auth', '')

    document.getElementById('project_name').value = "Project"
    document.getElementById('package_name').value = "Package"

    SaveContainer()
    UpdatePreviews()

    ButtonResetDatasClicked(button)
}

function download(file_name, file_content){

    let element = document.createElement('a');
    element.style.display = 'none';

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(file_content));
    element.setAttribute('target', '_blank');
    element.setAttribute('download', file_name);
    document.body.appendChild(element)

    element.click();
    document.body.remove(element)

}

function CopyToClipboard(button){
    preview_text.select();
    document.execCommand('copy')
    window.getSelection().removeAllRanges();
    ButtonCopiedClicked(button);
}

function EditPreviewText(button){
    if(preview_text.disabled){
        preview_text.disabled = false;
        button.innerHTML = 'Save change <i class="far fa-save ps-1"></i>'
    } else {
        preview_text.disabled = true;
        button.innerHTML ='Manual edit <i class="far fa-edit ps-1"></i>'
    }
}

function SaveContainer(){
    let saved = []
    containers.forEach((container) => {
        saved.push(container.toString());
    })
    setWithExpiry('containers', JSON.stringify(saved))
}

function InitFormUpdate(){
    
    project_input = document.getElementById('project_name')
    package_input = document.getElementById('package_name')
    container_input = document.getElementById('container_name')

    inputs = [project_input, package_input, container_input];

    inputs.forEach((input) => {
        input.onkeyup = () => {
            if(input.getAttribute('id') != "container_name"){
                stringtable[input.getAttribute("id")] = input.value.replaceAll(' ', '_');
                setWithExpiry('stringtable', JSON.stringify(stringtable))
            }
            UpdatePreviews();
        }
        if(input.getAttribute('id') != "container_name"){
            input.addEventListener('change', () => {
                if(input.value == ""){
                    input.value = "Default"
                    stringtable[input.getAttribute("id")] = "Default"
                    UpdatePreviews();
                }
            })
        }

    })

    

}

function LanguageCheck(check){
    
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

    setWithExpiry('languages', languages.toString())

    let temp_disabled = '';

        if(containers.length == 0){temp_disabled = "disabled"}

    document.getElementById('keys-languages').innerHTML = "";
    languages.forEach((lang) => {
        document.getElementById('keys-languages').innerHTML = `${document.getElementById('keys-languages').innerHTML}
        <div class="input-group mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text" id="language-${lang}-label">${lang}</span>
            </div>
            <input type="text" name="${lang.toLowerCase}" class="form-control" id="langue-selected-${lang}" aria-describedby="language-${lang}-label" ${temp_disabled}>
        </div>
        `
    })

    document.getElementById('starting_language').innerHTML = "";
    languages.forEach((lang) => {
        document.getElementById('starting_language').innerHTML = `${document.getElementById('starting_language').innerHTML}
        <option value="${lang}">${lang}</option>`
    })

}

function CreateLanguages(custom_language){

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

function AddLanguage(button){

    let custom_language = document.getElementById('custom_language')
    
    if(custom_language.value == ""){ButtonAddLanguageClicked(button, 'danger', 'You need to name your custom language'); return;}
    if(all_languages.includes(custom_language.value)){ButtonAddLanguageClicked(button, 'danger', 'This language is already declared'); return;}
    if(custom_language.value == "Original"){ButtonAddLanguageClicked(button, 'danger', 'This language is reserved for Stringtable'); return;}
    custom_language.value = custom_language.value.replaceAll(' ', '')
    all_languages.push(custom_language.value)
    CreateLanguages(custom_language.value);

    ButtonAddLanguageClicked(button, 'success')
}

function InitSavedDatas(){

    if (getWithExpiry("stringtable") != null) {
        let datas = getWithExpiry("stringtable");
        document.getElementById('project_name').value = datas.project_name
        document.getElementById('package_name').value = datas.package_name
        stringtable = {
            "project_name": datas.project_name,
            "package_name": datas.package_name
        }
    } else {
        stringtable = {
            "project_name": "Project",
            "package_name": "Package"
        }
    }

    if (getWithExpiry("deepl_auth") != null) {
        deepl_auth = getWithExpiry("deepl_auth");
        document.getElementById('deepl_auth_input').value = deepl_auth
        UpdateDeeplAuthAPI(document.getElementById('deepl_auth_input'))
    }

    if (getWithExpiry("containers") != null) {
        let datas = getWithExpiry("containers");
        for(let i = 0; i <= (datas.length - 1); i++){
            let data = JSON.parse(datas[i])
            let container = new Container(data.name)
            for(let i = 0; i <= (data.keys).length - 1; i++){
                container.CreateKey(data.keys[i].name, data.keys[i].content)
            }
            containers.push(container)
        }
        UpdateContainerDrop();
        UpdatePreviews();
    }

}

document.getElementById('form_container').addEventListener('submit', (event) => {
    event.preventDefault();
    container_name = document.getElementById('container_name').value
})

document.getElementById('form_general').addEventListener('submit', (event) => {
    event.preventDefault();
})

document.getElementById('form_key').addEventListener('submit', (event) => {
    event.preventDefault();
})

window.addEventListener('load', () => {
    InitSavedDatas();
    UpdatePreviews();
    InitFormUpdate();

    ["French", "Russian","Spanish","Italian","Polish","Portuguese","German","Korean","Japanese","Chinese", "Turkish"].forEach((lang) => {
        CreateLanguages(lang)
    })
})


