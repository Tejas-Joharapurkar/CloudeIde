
const editPath = (baesUrl, output) => {
    console.log(baesUrl);

    const maskedData = output.replace(new RegExp(baesUrl, 'g'), '')
    return maskedData
}

let s = "D:\coludIde\server\Services"

const r = new RegExp("D:\\cloudIde\\server", "g")
console.log(r);

s.replace("/D:/coludIde/server/g", '')
console.log(s);
