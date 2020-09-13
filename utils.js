function getRandom(list) {
    const random = Math.floor(Math.random() * list.length);
    return list[random];
}

function isNumber(text) {
    return text.match(/^[0-9]+$/);
}

module.exports = {getRandom, isNumber};