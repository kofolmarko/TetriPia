const pixelNum = 144;
const rowsNum = 9;
const columnsNum = 16;
const colorPicker = document.getElementById('color');
const generateFrameBtn = document.getElementById('generate');
const frameCode = document.getElementById('frame_code');

let frame = [];

const main = () => {
    generatePixels();
    generateFrameBtn.addEventListener('click', () => {
        generateFrame();
    });
}

const generatePixels = () => {
    for (let i = 0; i < rowsNum; i++) {
        const newRow = document.createElement('div');

        newRow.style.display = 'flex';
        newRow.style.flexDirection = 'row';

        const canvas = document.getElementById('canvas');
        canvas.appendChild(newRow);

        for (let j = 0; j < columnsNum; j++) {
            const newPixel = document.createElement('div');

            newPixel.style.width = '20px';
            newPixel.style.height = '20px';
            newPixel.style.border = 'black solid 1px';

            newRow.appendChild(newPixel);
            frame.push(newPixel);
            newPixel.addEventListener('mouseover', (e) => {
                if (e.which === 1) {
                    onClickPaint(newPixel);
                }
            });
            newPixel.addEventListener('mousedown', (e) => {
                onClickPaint(newPixel);
            });
        }
    }
};

const onClickPaint = (newPixel) => {
    newPixel.style.backgroundColor = colorPicker.value;
};

const generateFrame = () => {
    arrayString = [];
    frame.forEach((pixel) => {
        if (!pixel.style.backgroundColor) {
            arrayString.push('(0, 0, 0)');
        } else {
            let pixelRGB = pixel.style.backgroundColor.split('b')[1];
            arrayString.push(pixelRGB);
        }
    });
    frameCode.value = 'frame = [' + arrayString + ']';
}

main();