const {femenineCharacteristics} = require('./femenineCharacteristics');
const {maleCharacteristics} = require('./maleCharacteristics');
const {otherCharacteristics} = require('./otherCharacteristics');

const randomItem = (characteristic) => {
    const random = Math.floor(Math.random() * characteristic.length);
    return characteristic[random];
}

const randomAvatar = (gender) => {
    if (gender === 'Femenino') {
        
        const topType = randomItem(femenineCharacteristics.topType);
        const accessoriesType = randomItem(femenineCharacteristics.accessoriesType);
        const hatColor = randomItem(femenineCharacteristics.hatColor);
        const hairColor = randomItem(femenineCharacteristics.hairColor);
        const clotheType = randomItem(femenineCharacteristics.clotheType);
        const clotheColor = randomItem(femenineCharacteristics.clotheColor);
        const eyeType = randomItem(femenineCharacteristics.eyeType);
        const eyebrowType = randomItem(femenineCharacteristics.eyebrowType);
        const mouthType = randomItem(femenineCharacteristics.mouthType);
        const skinColor = randomItem(femenineCharacteristics.skinColor);

        let url = `https://avataaars.io/?avatarStyle=Circle&topType=${topType}&accessoriesType=${accessoriesType}&hairColor=${hairColor}&hatColor=${hatColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`
        return url;
    } else if(gender === 'Masculino'){

        const topType = randomItem(maleCharacteristics.topType);
        const accessoriesType = randomItem(maleCharacteristics.accessoriesType);
        const hatColor = randomItem(maleCharacteristics.hatColor);
        const hairColor = randomItem(maleCharacteristics.hairColor);
        const facialHairType = randomItem(maleCharacteristics.facialHairType);
        const facialHairColor = randomItem(maleCharacteristics.facialHairColor);
        const clotheType = randomItem(maleCharacteristics.clotheType);
        const clotheColor = randomItem(maleCharacteristics.clotheColor);
        const eyeType = randomItem(maleCharacteristics.eyeType);
        const eyebrowType = randomItem(maleCharacteristics.eyebrowType);
        const mouthType = randomItem(maleCharacteristics.mouthType);
        const skinColor = randomItem(maleCharacteristics.skinColor);

        let url = `https://avataaars.io/?avatarStyle=Circle&topType=${topType}&accessoriesType=${accessoriesType}&hairColor=${hairColor}&hatColor=${hatColor}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`
        return url;
    }else if(gender === 'Otro'){

        const topType = randomItem(otherCharacteristics.topType);
        const accessoriesType = randomItem(otherCharacteristics.accessoriesType);
        const hatColor = randomItem(otherCharacteristics.hatColor);
        const hairColor = randomItem(otherCharacteristics.hairColor);
        const facialHairType = randomItem(otherCharacteristics.facialHairType);
        const facialHairColor = randomItem(otherCharacteristics.facialHairColor);
        const clotheType = randomItem(otherCharacteristics.clotheType);
        const clotheColor = randomItem(otherCharacteristics.clotheColor);
        const eyeType = randomItem(otherCharacteristics.eyeType);
        const eyebrowType = randomItem(otherCharacteristics.eyebrowType);
        const mouthType = randomItem(otherCharacteristics.mouthType);
        const skinColor = randomItem(otherCharacteristics.skinColor);

        let url = `https://avataaars.io/?avatarStyle=Circle&topType=${topType}&accessoriesType=${accessoriesType}&hairColor=${hairColor}&hatColor=${hatColor}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`
        return url;
    }

}

module.exports = {randomAvatar};