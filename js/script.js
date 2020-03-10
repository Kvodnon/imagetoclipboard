'use strict';

document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.hide'),
    copyButton = document.getElementById('copy');

  const canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");
  
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
  }

  const setCanvasWidth = (event) => {
    const image = event.path[0];

    canvas.width += image.width;
    canvas.height = image.height > canvas.height ? image.height : canvas.height;
  };
  
  const renderImages = () => {
    let imagePositionX = 0;

    for (const image of images) {
      ctx.drawImage(image, imagePositionX, 0,  image.width, image.height);
      imagePositionX += image.width;
    }

    const url = canvas.toDataURL("image/png");

    canvas.toBlob(function(blob) { 
      const item = new ClipboardItem({ "image/png": blob });
      navigator.clipboard.write([item]); 
    });
  };
});