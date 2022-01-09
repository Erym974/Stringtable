let Key = function(key_name, key_content){

    this.name = key_name
    this.key_content = key_content;

    Key.prototype.toString = function KeyToString() {
        let string = `{"name": "${this.name}", "content": ${JSON.stringify(key_content)}}`
        return string;
    }
    
}


