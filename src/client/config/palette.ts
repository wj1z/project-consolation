const accents = {
    hazel: Color3.fromRGB(188,171,174),
    dark_hazel: Color3.fromRGB(113,105,105),
    red: Color3.fromRGB(199, 76, 70)
};

const neutrals = {
	text: Color3.fromRGB(251,251,251),
	base: Color3.fromRGB(45, 46, 46),
	crust: Color3.fromRGB(15, 15, 15)
};

const base = {
    white: Color3.fromRGB(255, 255, 255),
    black: Color3.fromRGB(0, 0, 0)
};

const Palette = {
    ...accents,
    ...neutrals,
    ...base
};

export default Palette;