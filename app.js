const pixelNum = 144;
const rowsNum = 9;
const columnsNum = 16;
const pixelSize = '20px';
const colorPicker = document.getElementById('color');
const generateFrameBtn = document.getElementById('generate');
const frameCode = document.getElementById('frame_code');
const addFrameBtn = document.getElementById('add_frame');
const animGrid = document.getElementById('anim_grid');
const canvas = document.getElementById('canvas');
const sleepTime = document.getElementById('sleep_time');
const generateAnimBtn = document.getElementById('generate_anim');

let mainFrame = [];

const main = () => {
    generatePixels();
    generateFrameBtn.addEventListener('click', () => {
        frameCode.value = 'frame = [' + generateFrame(mainFrame) + ']';
    });
    addFrameBtn.addEventListener('click', () => {
        addFrame();
    });
    generateAnimBtn.addEventListener('click', () => {
        frameCode.value = generateAnimation();
    });
}

const generatePixels = () => {
    for (let i = 0; i < rowsNum; i++) {
        const newRow = document.createElement('div');

        newRow.style.display = 'flex';
        newRow.style.flexDirection = 'row';

        canvas.appendChild(newRow);

        for (let j = 0; j < columnsNum; j++) {
            const newPixel = document.createElement('div');

            newPixel.style.width = pixelSize;
            newPixel.style.height = pixelSize;
            newPixel.style.border = 'white solid 1px';
            newPixel.style.backgroundColor = 'rgb(0, 0, 0)';

            newRow.appendChild(newPixel);
            mainFrame.push(newPixel);
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

const generateFrame = (frame) => {
    arrayString = [];
    frame.forEach((pixel) => {
        if (!pixel.style.backgroundColor) {
            arrayString.push('(0, 0, 0)');
        } else {
            let pixelRGB = pixel.style.backgroundColor.split('b')[1];
            arrayString.push(pixelRGB);
        }
    });
    return arrayString;
}

const generateAnimation = () => {
    let animCode = '';

    animGrid.childNodes.forEach((node) => {
        let animFrame = [];
        node.childNodes.forEach((row) => {
            row.childNodes.forEach((pixel) => {
                animFrame.push(pixel);
            });
        });
        if (animFrame.length == 144) {
            animCode += ('duck_fill([' + generateFrame(animFrame) + '])');
            animCode += ('\ntime.sleep(' + sleepTime.value + ')\n');
        }
    });

    return animCode;
}

const addFrame = () => {
    const newFrame = canvas.cloneNode(true);
    newFrame.childNodes.forEach((node) => {
        node.childNodes.forEach((pixelNode) => {
            pixelNode.style.width = '10px';
            pixelNode.style.height = '10px';
            pixelNode.style.border = 'none';
        });
    });
    newFrame.style.margin = '20px';
    newFrame.draggable = 'true';
    animGrid.appendChild(newFrame);
};

main();