let result = fetch('https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=MY_TOKEN', {
    method: 'GET'
})

result.then(res => {
    return res.json()
}).then(res => {
    saveResponseToFile(res)
}).catch(err => {
    console.error(err)
})

function saveResponseToFile (data) {
    let decoded = decryptCipher(data.cifrado.toLowerCase(), data.numero_casas)
    let sha1 = encryptInSha1(decoded.toLowerCase())

    data.decifrado = decoded
    data.resumo_criptografico = sha1

    let blob = new Blob([JSON.stringify(data)], {type: 'application/json'})
    saveAs(blob, 'answer.json')
}

function decryptCipher (cipher, step) {
    const alphabetString = 'zyxwvutsrqponmlkjihgfedcba'
    let alphabet = []
    let decoded = []
    count = 0
    i = 0
    while (count <= (26 + step)) {
        if(count === 26) {
            i = 0
        }
        alphabet.push(alphabetString[i])
        count++
        i++
    }
    cipher.split('').map((char, index) => {
        if(alphabet.indexOf(char) === -1){
            decoded.push(char)
            return
        }
        decoded.push(alphabet[(alphabet.indexOf(char) + step)])
    })
    console.log(decoded.join(''))
    return decoded.join('')
}

function encryptInSha1 (text) {
    let shaObj = new jsSHA('SHA-1', 'TEXT')
    shaObj.update(text)
    return shaObj.getHash('HEX')
}

function sendAnswer () {
    const fileInput = document.querySelector('#answer')
    const file = fileInput.files[0]
    let formData = new FormData()
    formData.append('answer', file)

    let result = fetch('https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=MY_TOKEN', {
        method: 'POST',
        headers: new Headers(),
        body: formData
    })

    result.then(res => {
        return res.text()
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.error(err)
    })
}
