let Container = function(name){

    this.name = name;
    this.Keys = [];

    this.CreateKey = (key_name, key_content) => {
        let key = new Key(key_name, key_content);
        this.Keys.push(key)
    };

    this.RemoveKey = (key) => {
        let index = this.Keys.indexOf(key);
        this.Keys.splice(index, 1);
    };

    Container.prototype.toString = function ContainerToString() {
        let keyString =  "";
        this.Keys.forEach((key, index) => {
            let i = ','
            if(index == this.Keys.length - 1){i = ''}
            keyString = `${keyString}${key.toString()}${i}`
        })
        let string =  `{"name": "${this.name}", "keys": [${keyString}]}`
        
        return string;
    }

}