import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const ConvertPdfToImage = async (file) => {
  if (!file) return [];

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const imageArray = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    // scale for image clarity
    const viewport = page.getViewport({ scale: 2 });

    // create a canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // render page on canvas
    await page.render({ canvasContext: context, viewport }).promise;

    // convert canvas to image
    const imgData = canvas.toDataURL("image/png");
    imageArray.push(imgData);
  }

  return imageArray;
};
