const characteristics = {
    "topType": [
        "NoHair",
        "Eyepatch",
        "Hat",
        "Hijab",
        "Turban",
        "WinterHat1",
        "WinterHat2",
        "WinterHat3",
        "WinterHat4",
        "LongHairBigHair",
        "LongHairBob",
        "LongHairBun",
        "LongHairCurly",
        "LongHairCurvy",
        "LongHairDreads",
        "LongHairFrida",
        "LongHairFro",
        "LongHairFroBand",
        "LongHairNotTooLong",
        "LongHairShavedSides",
        "LongHairMiaWallace",
        "LongHairStraight",
        "LongHairStraight2",
        "LongHairStraightStrand",
        "ShortHairDreads01",
        "ShortHairDreads02",
        "ShortHairFrizzle",
        "ShortHairShaggyMullet",
        "ShortHairShortCurly",
        "ShortHairShortFlat",
        "ShortHairShortRound",
        "ShortHairShortWaved",
        "ShortHairSides",
        "ShortHairTheCaesar",
        "ShortHairTheCaesarSidePart"
    ],
    "accessoriesType": [
        "Blank",
        "Kurt",
        "Prescription01",
        "Prescription02",
        "Round",
        "Sunglasses",
        "Wayfarers"
    ],
    "hatColor": [
        "Black",
        "Blue01",
        "Blue02",
        "Blue03",
        "Gray01",
        "Gray02",
        "Heather",
        "PastelBlue",
        "PastelGreen",
        "PastelOrange",
        "PastelRed",
        "PastelYellow",
        "Pink",
        "Red",
        "White",
    ],
    "hairColor": [
        "Auburn",
        "Black",
        "Blonde",
        "BlondeGolden",
        "Brown",
        "BrownDark",
        "PastelPink",
        "Blue",
        "Platinum",
        "Red",
        "SilverGray"
    ],
    "facialHairType": [
        "Blank",
        "BeardMedium",
        "BeardLight",
        "BeardMagestic",
        "MoustacheFancy",
        "MoustacheMagnum"
    ],
    "facialHairColor": [
        "Auburn",
        "Black",
        "Blonde",
        "BlondeGolden",
        "Brown",
        "BrownDark",
        "Platinum",
        "Red",
    ],
    "clotheType": [
        "BlazerShirt",
        "BlazerSweater",
        "CollarSweater",
        "GraphicShirt",
        "Hoodie",
        "Overall",
        "ShirtCrewNeck",
        "ShirtScoopNeck",
        "ShirtVNeck"
    ],
    "clotheColor": [
        "Black",
        "Blue01",
        "Blue02",
        "Blue03",
        "Gray01",
        "Gray02",
        "Heather",
        "PastelBlue",
        "PastelGreen",
        "PastelOrange",
        "PastelRed",
        "PastelYellow",
        "Pink",
        "Red",
        "White",
    ],
    "eyeType": [
        "Default",
        "Happy",
        "Side",
        "Squint",
        "Surprised",
        "Wink",
        "WinkWacky"
    ],
    "eyebrowType": [
        "Default",
        "DefaultNatural",
        "FlatNatural",
        "RaisedExcited",
        "RaisedExcitedNatural",
        "UnibrowNatural",
        "UpDown",
        "UpDownNatural"
    ],
    "mouthType": [
        "Default",
        "Eating",
        "Grimace",
        "Serious",
        "Smile",
        "Tongue",
        "Twinkle",
    ],
    "skinColor": [
        "Tanned",
        "Yellow",
        "Pale",
        "Light",
        "Brown",
        "DarkBrown",
        "Black"
    ]
}

const randomItem = (characteristic) => {
    const random = Math.floor(Math.random() * characteristic.length);
    return characteristic[random];
}

const randomAvatar = (gender) => {
    if (gender === 'Femenino') {

        const topType = randomItem(characteristics.topType);
        const accessoriesType = randomItem(characteristics.accessoriesType);
        const hatColor = randomItem(characteristics.hatColor);
        const hairColor = randomItem(characteristics.hairColor);
        const clotheType = randomItem(characteristics.clotheType);
        const clotheColor = randomItem(characteristics.clotheColor);
        const eyeType = randomItem(characteristics.eyeType);
        const eyebrowType = randomItem(characteristics.eyebrowType);
        const mouthType = randomItem(characteristics.mouthType);
        const skinColor = randomItem(characteristics.skinColor);

        let url = `https://avataaars.io/?avatarStyle=Circle&topType=${topType}&accessoriesType=${accessoriesType}&hairColor=${hairColor}&hatColor=${hatColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`
        return url;
    } else {
        const topType = randomItem(characteristics.topType);
        const accessoriesType = randomItem(characteristics.accessoriesType);
        const hatColor = randomItem(characteristics.hatColor);
        const hairColor = randomItem(characteristics.hairColor);
        const facialHairType = randomItem(characteristics.facialHairType);
        const facialHairColor = randomItem(characteristics.facialHairColor);
        const clotheType = randomItem(characteristics.clotheType);
        const clotheColor = randomItem(characteristics.clotheColor);
        const eyeType = randomItem(characteristics.eyeType);
        const eyebrowType = randomItem(characteristics.eyebrowType);
        const mouthType = randomItem(characteristics.mouthType);
        const skinColor = randomItem(characteristics.skinColor);

        let url = `https://avataaars.io/?avatarStyle=Circle&topType=${topType}&accessoriesType=${accessoriesType}&hairColor=${hairColor}&hatColor=${hatColor}&facialHairType=${facialHairType}&facialHairColor=${facialHairColor}&clotheType=${clotheType}&clotheColor=${clotheColor}&eyeType=${eyeType}&eyebrowType=${eyebrowType}&mouthType=${mouthType}&skinColor=${skinColor}`
        return url;
    }

}

module.exports = {randomAvatar};