'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.hide'),
    copyButton = document.getElementById('copy'),
    totalImageWidth = document.getElementById('totalImageWidth');

  const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

    window.canvas = canvas;
    window.ctx = ctx;

  let images = [],
    promises = [];

  container.addEventListener('click', (event) => {
    const target = event.target;

    if (!target.matches('img')) return;

    target.parentNode.classList.add('hidden');
  });

  copyButton.addEventListener('click', (event) => {
    event.preventDefault();

    images = [];
    promises = [];
    canvas.width = 0;
    canvas.height = 0;

    joinImages();
  });


  const joinImages = () => {
    const remainingImages = document.querySelectorAll('.hide-on-click:not(.hidden) img');

    if (remainingImages.length) {
      for (const remainImage of remainingImages) {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = remainImage.src;

        images.push(image);

        promises.push(new Promise((resolve, reject) => {
          image.addEventListener('load', (event) => {
            setCanvasWidth(event);
            resolve();
          });
        }));
      }

      Promise.all(promises)
        .then(renderImages);
    } else {
      alert('Нет картинок на выбор.');
    }
  }

  const setCanvasWidth = (event) => {
    const image = event.path[0];

    canvas.width += image.width;
    canvas.height = image.height > canvas.height ? image.height : canvas.height;
  };

  const copyCanvasToClipboard = () => {
    canvas.toBlob(function (blob) {
      const item = new ClipboardItem({
        "image/png": blob
      });
      navigator.clipboard.write([item]);
    });
  };

  const renderImages = () => {
    const totalImage = new Image();
    let imagePositionX = 0;

    for (const image of images) {
      ctx.drawImage(image, imagePositionX, 0, image.width, image.height);
      imagePositionX += image.width;
    }
    
    totalImage.src = canvas.toDataURL("image/png");

    totalImage.addEventListener('load', () => {
      let totalWidth = totalImageWidth.value;

      if (!totalWidth) {
        totalWidth = totalImage.width;
      }

      canvas.width = totalWidth;
      canvas.height = totalImage.height * (totalWidth / totalImage.width);
      ctx.drawImage(totalImage, 0, 0, totalWidth, totalImage.height * (totalWidth / totalImage.width));
      
      copyCanvasToClipboard();
    });

  };
});