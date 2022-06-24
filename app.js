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
const copyScriptBtn = document.getElementById('copy_script');
const postFrameBtn = document.getElementById('post_frame');

let mainFrame = [];

const main = () => {
    generatePixels();

    generateFrameBtn.addEventListener('click', () => {
        frameCode.value = 'frame = [' + generateFrame(mainFrame) + ']';
        frameCode.style.backgroundColor = 'rgb(157, 255, 238)';
    });

    addFrameBtn.addEventListener('click', () => {
        addFrame();
    });

    generateAnimBtn.addEventListener('click', () => {
        frameCode.value = generateAnimation();
        frameCode.style.backgroundColor = 'rgb(255, 143, 143)';
    });

    copyScriptBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(frameCode.value)
            .then(() => {
              alert('Text copied to clipboard');
              frameCode.value = '';
              frameCode.style.backgroundColor = 'white';
            })
            .catch(err => {
              alert('Error in copying text: ', err);
            });
    });

    postFrameBtn.addEventListener('click', () => {
        let frameReqBody =  generateFrameReqBody(mainFrame);
        const requestObject = new XMLHttpRequest(); // object of request
        requestObject.onload = function() {
            document.getElementById("server_response").innerHTML = this.responseText; // displaying response text in paragraph tag
        }
debugger
        requestObject.open("POST", "http://localhost:1337/frame");
        requestObject.setRequestHeader("Content-type", "application/json; charset=utf-8"); // setting of headers  in request
        requestObject.send(JSON.stringify(frameReqBody)); // data to send in request
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
            newPixel.style.backgroundColor = 'rgb(0,0,0)';

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
            arrayString.push('(0,0,0)');
        } else {
            let pixelRGB = pixel.style.backgroundColor.split('b')[1];
            arrayString.push(pixelRGB);
        }
    });

    return arrayString;
}

const generateFrameReqBody = (frame) => {
    arrayString = [];
    frame.forEach((pixel) => {
        arrayString.push(pixel.style.backgroundColor.split('b')[1] + '#');
    });

    const items = arrayString; //… your array, filled with values
    const n = 9; //tweak this to add more items per line

    const result = new Array(Math.ceil(items.length / n))
    .fill()
    .map(_ => items.splice(0, n));

    for (let i = 0; i < result.length; i++) {
        rowStr = "";
        result[i].forEach((p) => {
            rowStr += p;
        });
        rowStr = rowStr.slice(0, rowStr.length - 1);
        rowStr = rowStr.replace(/\s/g, '');
        result[i] = rowStr;
    }

    return result;
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
    newFrame.classList.add('anim_frame');

    newFrame.addEventListener('click', () => {
        newFrame.remove();
    });

    animGrid.appendChild(newFrame);
};

main();