const imageResize = opts => {
    const { link, elem, img, MAX_WIDTH = 400, MAX_HEIGHT = 400 } = opts;

    console.log(elem);


    // const img = document.createElement("img");
    // // img.crossOrigin = '*';
    // img.src = link;


    let ctx = elem.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let width = img.width;
    let height = img.height;

    // if (width > height) {
    if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
    }
    // } else {
    //     if (height > MAX_HEIGHT) {
    //         width *= MAX_HEIGHT / height;
    //         height = MAX_HEIGHT;
    //     }
    // }
    elem.width = width;
    elem.height = height;
    ctx = elem.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    // return canvas;

};

export default imageResize;