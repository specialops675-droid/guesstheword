const fs = require("fs");
const path = require("path");



const wordFiles = {


    Fruits:"fruits.json",

    Animals:"animals.json",

    Foods:"foods.json"


};





let usedWords = [];








function loadWords(category){


    const filePath = path.join(


        __dirname,


        "../words",


        wordFiles[category]


    );




    return JSON.parse(

        fs.readFileSync(

            filePath,

            "utf8"

        )

    );


}









function shuffleWord(word){



    let letters = word.split("");

    let shuffled;



    do{


        shuffled = [...letters]

        .sort(()=>Math.random()-0.5)

        .join("");



    }

    while(shuffled === word);



    return shuffled;



}









function getRandomWord(){



    const categories = Object.keys(wordFiles);



    let category;

    let answer;



    let attempts = 0;







    do{



        category =

        categories[

            Math.floor(

                Math.random()*categories.length

            )

        ];







        const words = loadWords(category);






        answer =

        words[

            Math.floor(

                Math.random()*words.length

            )

        ].toUpperCase();






        attempts++;






        if(attempts > 300){


            console.log(

                "RESET WORD CACHE"

            );


            usedWords=[];


            break;


        }





    }

    while(

        usedWords.includes(answer)

    );







    usedWords.push(answer);






    console.log(

        "NEW WORD:",

        answer

    );







    return {



        category:category,


        answer:answer,


        shuffled:shuffleWord(answer)



    };



}








function resetWords(){



    usedWords=[];



    console.log(

        "WORD LIST CLEARED"

    );



}








module.exports={



    getRandomWord,

    resetWords



};