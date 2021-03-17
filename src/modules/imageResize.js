const imageResize = opts => {
    const { elem, img, MAX_WIDTH = 400 } = opts;

    let ctx = elem.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let width = img.width;
    let height = img.height;

    if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
    }
    elem.width = width;
    elem.height = height;
    ctx = elem.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

};

export default imageResize;