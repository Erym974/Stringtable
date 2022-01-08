let Container = function(name){

    this.name = name;
    this.Keys = [];

    this.CreateKey = (key_name, key_content, language) => {
        let key = new Key(key_name, key_content, language);
        this.Keys.push(key)
    };

    this.RemoveKey = (key) => {
        let index = this.Keys.indexOf(key);
        this.Keys.splice(index, 1);
    };

}