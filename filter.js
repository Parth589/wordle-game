/*
* this file is used to overwrite the original words_dictionary file fetched from https://github.com/dwyl/english-words/blob/master/words_dictionary.json
* it has nothing to do with game logic
*/

const fs = require('fs');
const path = require("path");
const start = async () => {
    let data = await fs.readFile(path.resolve(__dirname, './words_dictionary.json'), {},
        (err, data) => {
            if (!err) {
                data = data.toString();
                data = JSON.parse(data);
                let array = [];
                for (const dataKey in data) {
                    array.push(dataKey);
                }
                array = JSON.stringify(array);
                fs.writeFile(path.resolve(__dirname, './words_dictionary.json'), array,{},()=>{
                    console.log('success...');
                });
            }
        });
    console.log(data)

}
start();