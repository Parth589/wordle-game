const tileMapper = [['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', ''],];

const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '«', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'];

// preferred way to generate random word
const generateRandomWord = async () => {
    const response = await fetch("https://random-word-api.herokuapp.com/word?length=5");
    const data = await response.json();
    return data[0].toUpperCase();
};
// // not preferred
// let KEYWORDSARRAY;
// const pre = async () => {
//     const response = await fetch('./words_dictionary.json');
//     KEYWORDSARRAY = await response.json();
// }
// pre();
// const generateRandomWord = async () => {
//     const randomnumber = Math.random() * KEYWORDSARRAY.length;
//     return KEYWORDSARRAY[randomnumber];
// }
let currentRow = 0, currentCol = 0;
let wordle;
generateRandomWord().then((word) => {
    wordle = word;
}).catch((err) => {
    console.error('error:', err);
});

const msg = (msg) => {
    const elem = document.querySelector('.msg-wrapper');
    elem.classList.add('show');
    // document.querySelector('.msgWrapper').classList.remove('hide');
    elem.textContent = msg;
    setTimeout(() => {
        elem.classList.remove('show');
    }, 3000);
};

// handle button click
const btnClick = async (event) => {
    const currentLatter = event.target.getAttribute('data-letter');
    if (currentRow >= 5) return;
    if (currentLatter === 'ENTER') return msg('Need few more letters');
    if (currentLatter === '«') {
        if (currentCol > 0 && currentCol <= 4) {
            document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol - 1}"]`).innerText = '';
            currentCol--;
        }
        return;
    }
    //add current latter
    const elem = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol++}"]`);
    elem.innerText = currentLatter;

    if (currentCol >= 5) {
        //check for result
        await checkResult();
        currentCol = 0;
        currentRow++;
    }
};

// populate the keyboard
const keyboard = document.querySelector(".key-wrapper");
keys.forEach(key => {
    const btn = document.createElement('button');
    btn.setAttribute('data-letter', key);
    btn.addEventListener('click', btnClick);
    btn.innerText = key;
    keyboard.appendChild(btn);
});

//populate tiles
const tileWrapper = document.querySelector('.tile-wrapper');
tileMapper.forEach((row, rowIndex) => {
    row.forEach((rowElement, colIndex) => {
        const elem = document.createElement('span');
        elem.setAttribute('data-row', String(rowIndex));
        elem.setAttribute('data-col', String(colIndex));
        elem.innerText = rowElement;
        tileWrapper.appendChild(elem);
    });
});


// handle gameover
const gameover = () => {
    msg('Game over ✅');
};


// check result
const checkResult = async () => {
    let win = true;
    const guessRow = document.querySelectorAll(`[data-row="${currentRow}"]`);
    for (let index = 0; index < wordle.length; index++) {
        const e = wordle[index];
        const currentGuessLetter = guessRow[index].innerText;
        {
            if (currentGuessLetter === e) {
                setTimeout(() => {
                    guessRow[index].classList.add('overlay-green');
                    document.querySelector(`button[data-letter="${currentGuessLetter}"]`).classList.add('overlay-green');
                }, index * 700)
                continue;
            } else if (wordle.includes(currentGuessLetter)) {
                setTimeout(() => {
                    guessRow[index].classList.add('overlay-yellow');
                    document.querySelector(`button[data-letter="${currentGuessLetter}"]`).classList.add('overlay-yellow');
                }, index * 700)
                win = false;
                continue;
            } else {
                setTimeout(() => {
                    guessRow[index].classList.add('overlay-grey');
                    document.querySelector(`button[data-letter="${currentGuessLetter}"]`).classList.add('overlay-grey');
                }, index * 700)
                win = false;
                continue;
            }
        }
    }

    if (win === true) {
        setTimeout(() => {
            msg('You won... 🎉');
            setTimeout(
                gameover, 3000
            )
        }, 5 * 700)
    }
    if (win === false) {
        setTimeout(() => {
            msg('Not matched... 😿');
            if (currentRow >= 5) {
                setTimeout(
                    gameover, 3000
                )
            }
        }, 5 * 700)
    }
    return win;
};