const accents = {};

const neutrals = {
	text: Color3.fromRGB(255, 255, 255),
	base: Color3.fromRGB(45, 45, 45),
	crust: Color3.fromRGB(28, 28, 28)
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