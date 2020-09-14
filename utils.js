function getRandom(list) {
    const random = Math.floor(Math.random() * list.length);
    return list[random];
}

function isNumber(text) {
    if(text) {
        return text.match(/^[0-9]+$/);
    } else {
        return false;
    }
}

module.exports = {getRandom, isNumber};
