const ButtonDownloadClicked = (button) => {
    button.style.transition = "all 0.3s";
    button.classList.remove('btn-dark');
    button.classList.add('btn-success');

    button.innerHTML = 'Download started <i class="fas fa-check ps-1"></i>'

    setTimeout(function(){
        button.classList.remove('btn-success');
        button.classList.add('btn-dark');
        button.innerHTML= 'Download file <i class="fas fa-arrow-circle-down ps-1"></i>'
    }, 1000)
}
const ButtonCopiedClicked = (button) => {
    button.style.transition = "all 0.3s";
    button.style.width = "180px"
    button.classList.remove('btn-dark');
    button.classList.add('btn-success');

    button.innerHTML = 'Copied <i class="fas fa-check ps-1"></i>'

    setTimeout(function(){
        button.classList.remove('btn-success');
        button.classList.add('btn-dark');
        button.innerHTML= 'Copy to clipboard <i class="far fa-copy ps-1"></i>'
    }, 1000)
}

const ButtonCreateContainerClicked = (button, type) => {
    button.style.transition = "all 0.3s";
    button.classList.remove('btn-dark');
    button.classList.add(`btn-${type}`);

    switch (type) {
        case "success":
            button.innerHTML = 'Container created <i class="fas fa-check ps-1"></i>'
            break;

        case "danger":
            button.disabled = true;
            button.innerHTML = 'You need to put a name <i class="fas fa-exclamation ps-1"></i>'
            break;
    }

    setTimeout(function(){
        button.disabled = false;
        button.classList.remove(`btn-${type}`);
        button.classList.add('btn-dark');
        button.innerHTML= 'Create container <i class="fas fa-plus-circle ps-1"></i></i>'
    }, 2500)


}

const ButtonCreateKeyClicked = (button, type, error) => {
    button.style.transition = "all 0.3s";
    button.classList.remove('btn-dark');
    button.classList.add(`btn-${type}`);

    switch (type) {
        case "success":
            button.innerHTML = 'Key created <i class="fas fa-check ps-1"></i>'
            break;

        case "danger":
            button.disabled = true;
            button.innerHTML = `${error} <i class="fas fa-exclamation ps-1"></i>`
            break;
    }

    setTimeout(function(){
        button.disabled = false;
        button.classList.remove(`btn-${type}`);
        button.classList.add('btn-dark');
        button.innerHTML= 'Create key <i class="fas fa-plus-circle ps-1"></i></i>'
    }, 2000)
}

const ButtonAddLanguageClicked = (button, type, error) => {
    button.style.transition = "all 0.3s";
    button.classList.remove('btn-dark');
    button.classList.add(`btn-${type}`);

    switch (type) {
        case "success":
            button.innerHTML = 'Language added <i class="fas fa-check ps-1"></i>'
            break;

        case "danger":
            button.disabled = true;
            button.innerHTML = `${error} <i class="fas fa-exclamation ps-1"></i>`
            break;
    }

    setTimeout(function(){
        button.disabled = false;
        button.classList.remove(`btn-${type}`);
        button.classList.add('btn-dark');
        button.innerHTML= 'Add language <i class="fas fa-plus-circle ps-1"></i>'
    }, 2000)
}

const ButtonImportFileClicked = (button, type, error) => {
    button.style.transition = "all 0.3s";
    button.classList.remove('btn-dark');
    button.classList.add(`btn-${type}`);

    switch (type) {
        case "success":
            button.innerHTML = 'File imported <i class="fas fa-check ps-1"></i>'
            break;

        case "danger":
            button.disabled = true;
            button.innerHTML = `${error} <i class="fas fa-exclamation ps-1"></i>`
            break;
    }

    setTimeout(function(){
        button.disabled = false;
        button.classList.remove(`btn-${type}`);
        button.classList.add('btn-dark');
        button.innerHTML= 'Import file <i class="fas fa-file-import"></i>'
    }, 2000)
}

const ButtonTranslateClicked = (button, state, message) => {

    button.style.transition = "all 0.3s";
    button.classList.remove('btn-dark');

    switch (state){
        case "loading":
            button.classList.add(`btn-warning`);
            button.innerHTML= 'Translating... <i class="fas fa-spinner"></i>'
            break;
        case "error":
            button.classList.remove(`btn-warning`);
            button.classList.add(`btn-danger`);
            button.innerHTML= `${message} <i class="fas fa-exclamation ps-1"></i>`
            setTimeout(function(){
                button.classList.remove(`btn-warning`);
                button.classList.remove(`btn-danger`);
                button.classList.remove(`btn-success`);
                button.classList.add('btn-dark');
                button.innerHTML= 'Translate original key <i class="fas fa-language"></i>'
            }, 2000)
            break;
        case "success":
            button.classList.remove(`btn-warning`);
            button.classList.add(`btn-success`);
            button.innerHTML= 'Translation completed <i class="fas fa-check ps-1"></i>'
            setTimeout(function(){
                button.classList.remove(`btn-warning`);
                button.classList.remove(`btn-danger`);
                button.classList.remove(`btn-success`);
                button.classList.add('btn-dark');
                button.innerHTML= 'Translate original key <i class="fas fa-language"></i>'
            }, 2000)
            break;
    }

}